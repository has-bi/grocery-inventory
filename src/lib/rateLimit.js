/**
 * In-process login throttle with progressive lockout.
 *
 * Deliberate limitation: serverless instances do not share memory, so a
 * determined attacker who lands on fresh instances gets extra attempts. This is
 * a speed bump, not a wall — the real brute-force cost is scrypt (~100ms per
 * guess) over a 6-digit space. Swap the Map for Redis if this ever needs to
 * hold against a serious attacker.
 */

const attempts = new Map();

const FREE_ATTEMPTS = 4; // failures allowed before any lock kicks in
const BASE_LOCK_MS = 60 * 1000;
const MAX_LOCK_MS = 60 * 60 * 1000;
const ENTRY_TTL_MS = 2 * 60 * 60 * 1000;
const MAX_ENTRIES = 5000;

function prune(now) {
  for (const [key, entry] of attempts) {
    if (now - entry.updated > ENTRY_TTL_MS) attempts.delete(key);
  }
  // Hard bound so a spoofed-IP flood cannot grow the map without limit.
  if (attempts.size > MAX_ENTRIES) {
    const excess = attempts.size - MAX_ENTRIES;
    let i = 0;
    for (const key of attempts.keys()) {
      if (i++ >= excess) break;
      attempts.delete(key);
    }
  }
}

/** Identifies the caller. Vercel sets x-forwarded-for at the edge. */
export function clientKey(request) {
  const fwd = request.headers.get("x-forwarded-for") || "";
  const ip = fwd.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
  return ip;
}

export function checkLock(key) {
  const now = Date.now();
  prune(now);

  const entry = attempts.get(key);
  if (!entry?.lockedUntil || entry.lockedUntil <= now) return { locked: false };

  return {
    locked: true,
    retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000),
  };
}

export function recordFailure(key) {
  const now = Date.now();
  const entry = attempts.get(key) ?? { fails: 0, lockedUntil: 0, updated: now };

  entry.fails += 1;
  entry.updated = now;

  if (entry.fails > FREE_ATTEMPTS) {
    // 1m, 2m, 4m, 8m … capped at an hour.
    const step = entry.fails - FREE_ATTEMPTS - 1;
    const wait = Math.min(BASE_LOCK_MS * 2 ** step, MAX_LOCK_MS);
    entry.lockedUntil = now + wait;
  }

  attempts.set(key, entry);

  return {
    remaining: Math.max(0, FREE_ATTEMPTS - entry.fails),
    retryAfterSeconds: entry.lockedUntil > now
      ? Math.ceil((entry.lockedUntil - now) / 1000)
      : 0,
  };
}

export function recordSuccess(key) {
  attempts.delete(key);
}
