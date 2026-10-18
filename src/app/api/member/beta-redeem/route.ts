import { NextResponse } from "next/server";

import { applyMembershipCookie, getAuthenticatedMemberSession, getAuthenticatedSupabaseUser, requireAuthenticatedMemberWrite } from "@/lib/auth/server";
import { enforceMemberRateLimit } from "@/lib/auth/rate-limit";
import { getNeonSql } from "@/lib/db/neon";
import { BETA_REDEEM_GENERIC_ERROR, hashBetaCode, normalizeBetaCode, redeemBetaCode, type SqlClient } from "@/lib/member/neon-beta-codes";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

/**
 * Redeem a single-use alpha/beta code for 90 days of Gold-equivalent educational access.
 * No payment details, no subscription, nothing charged. The account is ALWAYS the
 * server-verified session user; any account field in the request body is ignored.
 */
export async function POST(request: Request) {
  // Authenticated session + same-origin CSRF + per-IP rate limit.
  const auth = await requireAuthenticatedMemberWrite(request, "beta-redeem");
  if (!auth.ok) return auth.response;

  const user = await getAuthenticatedSupabaseUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers: NO_STORE });
  if (!user.email_confirmed_at) {
    return NextResponse.json({ error: "Please verify your email address before redeeming an access code." }, { status: 403, headers: NO_STORE });
  }

  // Strict per-account limit. Codes carry 160 random bits, so guessing is infeasible regardless.
  const perUser = enforceMemberRateLimit(`beta-redeem-user:${user.id}`, 5, 15 * 60_000);
  if (!perUser.allowed) return NextResponse.json({ error: "Too many attempts. Please wait 15 minutes and try again." }, { status: 429, headers: NO_STORE });

  const body = await request.json().catch(() => ({})) as { code?: unknown; acknowledgedTerms?: unknown };
  if (body.acknowledgedTerms !== true) {
    return NextResponse.json({ error: "Please accept the Beta Terms and Privacy Notice to continue." }, { status: 400, headers: NO_STORE });
  }

  const normalized = normalizeBetaCode(body.code);
  if (!normalized) return NextResponse.json({ error: BETA_REDEEM_GENERIC_ERROR }, { status: 400, headers: NO_STORE });

  const sql = getNeonSql() as unknown as SqlClient | null;
  if (!sql) return NextResponse.json({ error: "Beta redemption is temporarily unavailable." }, { status: 503, headers: NO_STORE });

  let result;
  try {
    result = await redeemBetaCode(sql, hashBetaCode(normalized), user.id);
  } catch (error) {
    console.error("[beta] redemption failed", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Beta redemption is temporarily unavailable." }, { status: 503, headers: NO_STORE });
  }

  if (result.outcome === "invalid") return NextResponse.json({ error: BETA_REDEEM_GENERIC_ERROR }, { status: 400, headers: NO_STORE });
  if (result.outcome === "account_already_redeemed") {
    return NextResponse.json({ error: "This account has already used a beta access code. Your new code was not used." }, { status: 409, headers: NO_STORE });
  }

  // Re-read the session so the Gold mapping comes from the authoritative Neon record,
  // then issue a tier cookie whose signed expiry equals the grant's end.
  const session = await getAuthenticatedMemberSession();
  const response = NextResponse.json(
    { ok: true, message: "Beta access activated: all eight tracks, Levels 1–5 and every language for 90 days. No payment, nothing charged.", expiresAt: result.expiresAt },
    { headers: NO_STORE },
  );
  if (session.user) applyMembershipCookie(response, session.user.membershipTier, result.expiresAt);
  return response;
}
