import { NextResponse } from "next/server";

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

async function callScript(options) {
  if (!APPS_SCRIPT_URL) {
    return NextResponse.json({ error: "APPS_SCRIPT_URL not configured" }, { status: 500 });
  }

  try {
    let res;
    if (options.method === "GET") {
      const params = new URLSearchParams(options.params);
      res = await fetch(`${APPS_SCRIPT_URL}?${params}`);
    } else {
      res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options.body),
      });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  if (type === "logs") {
    return callScript({ method: "GET", params: { action: "getAll", sheet: "TaskLogs" } });
  }
  return callScript({ method: "GET", params: { action: "getAll", sheet: "Tasks" } });
}

export async function POST(request) {
  const body = await request.json();
  return callScript({ method: "POST", body });
}
