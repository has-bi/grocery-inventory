/**
 * Google Sheets silently coerces rep ranges into dates: typing "10-12" stores
 * 12 October and merely *displays* it as "10-12", so the sheet looks correct
 * while the API returns "2026-10-12".
 *
 * The sheet-side fix is to format the column as plain text (see
 * repairProgramSheet in google-apps-script.js). This function is the client
 * side of that defence, so a row entered before the repair — or into a fresh
 * column that lost its formatting — still renders as a rep range.
 */

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/;

export function normalizeReps(value) {
  if (value === null || value === undefined) return "";

  // A Date can arrive directly when the payload is not serialised through JSON.
  if (value instanceof Date && !isNaN(value)) {
    return `${value.getMonth() + 1}-${value.getDate()}`;
  }

  const str = String(value).trim();
  const m = str.match(ISO_DATE);
  if (!m) return str;

  // Reps are never a real date, so a date here is always the coercion bug.
  // Sheets parsed "M-D", so month and day map straight back, unpadded.
  const month = parseInt(m[2], 10);
  const day = parseInt(m[3], 10);
  if (!month || !day) return str;

  return `${month}-${day}`;
}
