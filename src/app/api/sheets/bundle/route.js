import { NextResponse } from "next/server";
import { gasBundle, GasError } from "@/lib/gas";

/**
 * Every sheet in one Apps Script execution.
 *
 * Five parallel requests meant five concurrent executions of the same script,
 * which Apps Script throttles — the logs showed all five failing on the same
 * second, roughly half the time.
 */
export async function GET() {
  try {
    return NextResponse.json(await gasBundle());
  } catch (e) {
    const status =
      e instanceof GasError
        ? e.kind === "config"
          ? 500
          : e.kind === "unsupported"
            ? 501 // Apps Script predates getBundle; the client falls back.
            : 502
        : 502;
    return NextResponse.json({ error: e.message, kind: e.kind ?? "unknown" }, { status });
  }
}
