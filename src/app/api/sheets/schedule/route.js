import { NextResponse } from "next/server";
import { gasGet, gasPost, GasError } from "@/lib/gas";

const SHEET = "Schedule";

function fail(e) {
  // Surface the specific reason: a bare 500 sent people hunting in the wrong place.
  const status = e instanceof GasError && e.kind === "config" ? 500 : 502;
  return NextResponse.json({ error: e.message, kind: e.kind ?? "unknown" }, { status });
}

export async function GET() {
  try {
    return NextResponse.json(await gasGet(SHEET));
  } catch (e) {
    return fail(e);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    return NextResponse.json(await gasPost({ ...body, sheet: SHEET }));
  } catch (e) {
    return fail(e);
  }
}
