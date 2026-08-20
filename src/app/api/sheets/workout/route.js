import { NextResponse } from "next/server";
const URL = process.env.APPS_SCRIPT_URL;

export async function GET() {
  const res = await fetch(`${URL}?action=getAll&sheet=WorkoutLogs`);
  return NextResponse.json(await res.json());
}

export async function POST(request) {
  const body = await request.json();
  const res = await fetch(URL, {
    method: "POST",
    body: JSON.stringify({ ...body, sheet: "WorkoutLogs" }),
  });
  return NextResponse.json(await res.json());
}
