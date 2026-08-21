import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * PIN storage and verification. Node-only — the login route is the sole caller,
 * and middleware never needs the PIN itself.
 *
 * scrypt is deliberately slow (~100ms here). For a numeric PIN that cost is the
 * primary brute-force defence: it caps guessing at roughly 10/second per
 * instance even before the rate limiter refuses anything.
 */

const PARAMS = { N: 16384, r: 8, p: 1, keylen: 32 };
export const MIN_PIN_LENGTH = 6;

function derive(pin, salt) {
  return new Promise((resolve, reject) => {
    scrypt(pin, salt, PARAMS.keylen, PARAMS, (err, key) =>
      err ? reject(err) : resolve(key)
    );
  });
}

export async function hashPin(pin) {
  const salt = randomBytes(16);
  const key = await derive(String(pin), salt);
  return `scrypt$${PARAMS.N}$${PARAMS.r}$${PARAMS.p}$${salt.toString("base64")}$${key.toString("base64")}`;
}

/**
 * Verifies against a stored scrypt hash. Falls back to a constant-time compare
 * when only a plaintext PIN is configured, so an existing deployment keeps
 * working instead of locking its owner out mid-migration.
 */
export async function verifyPin(pin, stored) {
  const candidate = String(pin ?? "");
  if (!candidate || !stored) return false;

  if (!stored.startsWith("scrypt$")) {
    return constantTimeEquals(candidate, stored);
  }

  const parts = stored.split("$");
  if (parts.length !== 6) return false;

  const [, n, r, p, saltB64, keyB64] = parts;
  try {
    const salt = Buffer.from(saltB64, "base64");
    const expected = Buffer.from(keyB64, "base64");
    const actual = await new Promise((resolve, reject) => {
      scrypt(
        candidate,
        salt,
        expected.length,
        { N: Number(n), r: Number(r), p: Number(p) },
        (err, key) => (err ? reject(err) : resolve(key))
      );
    });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/** Length-independent comparison; timingSafeEqual throws on length mismatch. */
function constantTimeEquals(a, b) {
  const ab = Buffer.from(String(a), "utf8");
  const bb = Buffer.from(String(b), "utf8");
  if (ab.length !== bb.length) {
    // Still burn a comparison so the timing does not reveal the length.
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

/** The configured credential, preferring the hashed form. */
export function configuredPin() {
  const hash = process.env.AUTH_PIN_HASH;
  if (hash) return { value: hash, hashed: true };

  const plain = process.env.AUTH_PIN || process.env.AUTH_SECRET;
  if (plain) return { value: plain, hashed: false };

  return null;
}
