#!/usr/bin/env node
/**
 * Generates the auth environment values.
 *
 *   node scripts/setup-auth.js            # random 6-digit PIN
 *   node scripts/setup-auth.js 481920     # use a PIN you chose
 *
 * Prints AUTH_PIN_HASH and SESSION_SECRET to paste into Vercel. The PIN itself
 * is only shown here and is never stored anywhere in the project.
 */
import { randomBytes, randomInt, scrypt } from "node:crypto";

const PARAMS = { N: 16384, r: 8, p: 1, keylen: 32 };
const MIN_LENGTH = 6;

function hash(pin, salt) {
  return new Promise((resolve, reject) => {
    scrypt(pin, salt, PARAMS.keylen, PARAMS, (err, key) =>
      err ? reject(err) : resolve(key)
    );
  });
}

const provided = process.argv[2];

if (provided && !/^\d+$/.test(provided)) {
  console.error("PIN must contain digits only.");
  process.exit(1);
}
if (provided && provided.length < MIN_LENGTH) {
  console.error(`PIN must be at least ${MIN_LENGTH} digits.`);
  process.exit(1);
}

// randomInt is uniform; Math.random would bias the digits.
const pin =
  provided ??
  Array.from({ length: MIN_LENGTH }, () => randomInt(0, 10)).join("");

const salt = randomBytes(16);
const key = await hash(pin, salt);

const pinHash = `scrypt$${PARAMS.N}$${PARAMS.r}$${PARAMS.p}$${salt.toString("base64")}$${key.toString("base64")}`;
const sessionSecret = randomBytes(32).toString("base64url");

console.log(`
Your PIN (memorise it — it is not stored anywhere):

    ${pin}

Set these in Vercel → Settings → Environment Variables, then redeploy:

AUTH_PIN_HASH=${pinHash}
SESSION_SECRET=${sessionSecret}

Then DELETE the old AUTH_SECRET variable.

Changing either value signs out every existing session.
`);
