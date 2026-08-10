/**
 * POST /api/auth/sync-membership
 *
 * Sets a signed httpOnly membership-tier cookie so that the server-side
 * curriculum access gate can read the viewer's tier on subsequent requests
 * without relying on client-side localStorage.
 *
 * DELETE /api/auth/sync-membership
 *
 * Clears the membership cookie (called on logout).
 *
 * Security notes:
 * - The cookie value is HMAC-signed to prevent trivial forgery.
 * - httpOnly prevents JavaScript from reading the cookie.
 * - The client's localStorage-based auth remains the canonical source of truth;
 *   this cookie is a server-readable mirror used solely for content gating.
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { type NormalizedCurriculumTier } from "@/lib/curriculum/access";
import { MEMBERSHIP_TIER_COOKIE, VALID_TIERS, signTier } from "@/lib/curriculum/membership-cookie";

export async function POST(request: Request) {
  let tier: string;
  try {
    const body = (await request.json()) as { tier?: unknown };
    tier = typeof body.tier === "string" ? body.tier : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!(VALID_TIERS as string[]).includes(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set(MEMBERSHIP_TIER_COOKIE, signTier(tier as NormalizedCurriculumTier), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    // 30-day expiry matches a reasonable session window
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set(MEMBERSHIP_TIER_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });
  return NextResponse.json({ ok: true });
}
