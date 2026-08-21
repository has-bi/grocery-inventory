import { NextResponse } from "next/server";
import { SESSION_COOKIE, isSecureRuntime } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Attributes must match the ones used when setting, or the browser keeps it.
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: isSecureRuntime(),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
