import { NextResponse } from "next/server";

function getUrl() {
  const url = process.env.APPS_SCRIPT_URL;
  if (!url) throw new Error("APPS_SCRIPT_URL is not configured");
  return url;
}

export async function GET() {
  try {
    const res = await fetch(`${getUrl()}?action=getAll&sheet=WorkoutLogs`);
    if (!res.ok) throw new Error(`GAS error: ${res.status}`);
    return NextResponse.json(await res.json());
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const res = await fetch(getUrl(), {
      method: "POST",
      body: JSON.stringify({ ...body, sheet: "WorkoutLogs" }),
    });
    return NextResponse.json(await res.json());
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
