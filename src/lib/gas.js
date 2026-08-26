/**
 * Talks to the Google Apps Script web app.
 *
 * Two things went wrong in production without leaving a usable trace:
 *   - the request had no timeout, so a silent Apps Script hung until Vercel
 *     killed the function at 10s and returned a bare 504
 *   - when a deployment is not shared with "Anyone", Apps Script answers with
 *     an HTML sign-in page rather than JSON, which read as "invalid response"
 *
 * Both now fail fast and say which one happened.
 */

// Comfortably under Vercel's 10s function limit, so the app answers instead of
// being killed mid-flight.
const TIMEOUT_MS = 8000;

function requireUrl() {
  const url = process.env.APPS_SCRIPT_URL;
  if (!url) {
    throw new GasError(
      "APPS_SCRIPT_URL belum diset di environment variable.",
      "config"
    );
  }
  // Only reject what cannot possibly work. Pinning the hostname to
  // script.google.com looked tidier but broke local mocks and any proxy in
  // front of Apps Script — and the timeout and sign-in-page checks below
  // already catch the misconfigurations that actually happen.
  try {
    const { protocol } = new URL(url);
    if (protocol !== "https:" && protocol !== "http:") throw new Error();
  } catch {
    throw new GasError(`APPS_SCRIPT_URL bukan URL yang valid: "${url}"`, "config");
  }
  return url;
}

export class GasError extends Error {
  constructor(message, kind) {
    super(message);
    this.name = "GasError";
    this.kind = kind;
  }
}

async function call(url, init) {
  let res;
  try {
    res = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (err) {
    if (err?.name === "TimeoutError" || err?.name === "AbortError") {
      throw new GasError(
        `Apps Script nggak jawab dalam ${TIMEOUT_MS / 1000} detik. Cek deployment-nya masih aktif dan URL-nya yang terbaru.`,
        "timeout"
      );
    }
    throw new GasError(`Nggak bisa nyambung ke Apps Script: ${err.message}`, "network");
  }

  const body = await res.text();

  // A restricted deployment redirects to a Google sign-in page. It arrives as
  // HTML with a 200, so the status alone never reveals the misconfiguration.
  const looksLikeHtml =
    body.trimStart().startsWith("<") ||
    (res.headers.get("content-type") || "").includes("text/html");

  if (looksLikeHtml) {
    throw new GasError(
      "Apps Script balikin halaman login, bukan data. Di GAS: Deploy → Manage deployments → set 'Who has access' ke 'Anyone'.",
      "auth"
    );
  }

  if (!res.ok) {
    throw new GasError(`Apps Script balas ${res.status}.`, "http");
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new GasError("Respons Apps Script bukan JSON yang valid.", "parse");
  }
}

const BUNDLE_SHEETS = ["BodyMetrics", "Exercises", "WorkoutLogs", "Programs", "Schedule"];

/**
 * All sheets in one execution.
 *
 * Apps Script cold starts and momentary contention make a single attempt
 * flaky, so one transient failure is retried once. Config and auth problems
 * are permanent, and retrying those only doubles the wait.
 */
export async function gasBundle() {
  let lastError;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const data = await call(`${requireUrl()}?action=getBundle`);

      if (data?.error) {
        if (/unknown action/i.test(data.error)) {
          throw new GasError(
            "Apps Script-nya belum punya getBundle. Paste ulang google-apps-script.js lalu deploy lagi.",
            "unsupported"
          );
        }
        throw new GasError(data.error, "http");
      }

      // A response missing every known sheet is not a usable bundle.
      if (!data || !BUNDLE_SHEETS.some((s) => Array.isArray(data[s]))) {
        throw new GasError("Bundle dari Apps Script formatnya nggak sesuai.", "parse");
      }
      return data;
    } catch (err) {
      lastError = err;
      const permanent =
        err instanceof GasError && ["config", "auth", "unsupported"].includes(err.kind);
      if (permanent || attempt === 1) throw err;
    }
  }

  throw lastError;
}

export function gasGet(sheet) {
  return call(`${requireUrl()}?action=getAll&sheet=${encodeURIComponent(sheet)}`);
}

export function gasPost(payload) {
  return call(requireUrl(), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
