import { NextResponse } from "next/server";

import { applyCuAccessCookie, clearCuAccessCookie, verifyCuPassword } from "@/lib/cu/auth";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = payload?.password?.trim() || "";

  if (!password || !verifyCuPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  return applyCuAccessCookie(NextResponse.json({ ok: true }));
}

export async function DELETE() {
  return clearCuAccessCookie(NextResponse.json({ ok: true }));
}
