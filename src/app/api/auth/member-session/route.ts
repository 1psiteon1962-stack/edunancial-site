/**
 * POST /api/auth/member-session
 *   Sets a signed server-side member session cookie.
 *   Called by authContext.tsx after a successful login.
 *   Body: { authTier: string; email: string }
 *
 * DELETE /api/auth/member-session
 *   Clears the member session cookie.
 *   Called by authContext.tsx on logout.
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  MEMBER_SESSION_COOKIE,
  authTierToCurriculumTier,
  createMemberSessionValue,
} from "@/lib/curriculum/member-session";

const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

export async function POST(request: Request) {
  let body: { authTier?: string; email?: string };
  try {
    body = (await request.json()) as { authTier?: string; email?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { authTier, email } = body;
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const curriculumTier = authTierToCurriculumTier(authTier);
  const cookieValue = createMemberSessionValue(curriculumTier, email);

  const cookieStore = await cookies();
  cookieStore.set(MEMBER_SESSION_COOKIE, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
    sameSite: "lax",
  });

  return NextResponse.json({ ok: true, tier: curriculumTier });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set(MEMBER_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
    sameSite: "lax",
  });

  return NextResponse.json({ ok: true });
}
