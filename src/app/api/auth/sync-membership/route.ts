import { NextResponse } from "next/server";

import { applyMembershipCookie, clearMembershipCookie, getAuthenticatedMemberSession } from "@/lib/auth/server";

export async function POST() {
  const session = await getAuthenticatedMemberSession();
  if (!session.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const response = NextResponse.json({ ok: true, tier: session.user.membershipTier, betaAccess: session.user.betaAccess ?? null });
  const betaExpiry = session.user.betaAccess?.status === "active" ? session.user.betaAccess.betaExpiresAt : null;
  applyMembershipCookie(response, session.user.membershipTier, betaExpiry);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearMembershipCookie(response);
  return response;
}
