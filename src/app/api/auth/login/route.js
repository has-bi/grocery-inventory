import { NextResponse } from "next/server";

export async function POST(request) {
  const { pin } = await request.json();

  if (!pin || pin !== process.env.AUTH_SECRET) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("auth_token", process.env.AUTH_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
