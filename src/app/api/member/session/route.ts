import { NextResponse } from "next/server";

import {
  applyMembershipCookie,
  clearMembershipCookie,
  getAuthenticatedMemberSession,
  getAuthenticatedSupabaseUser,
} from "@/lib/auth/server";
import { validateMemberCsrf } from "@/lib/auth/csrf";
import { recordServerKpiEventOnce } from "@/lib/kpi/server-events";
import { detectTrustedRequestCountry } from "@/lib/location/request-country";
import { recordSecurityEvent } from "@/lib/member/security";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server-auth";

export async function GET(request: Request) {
  const session = await getAuthenticatedMemberSession();
  const response = NextResponse.json(session);

  if (session.user) {
    // KPI: one "signup" per account (idempotent), dated when the account was created.
    const country = detectTrustedRequestCountry(request.headers);
    await recordServerKpiEventOnce({
      eventName: "signup",
      replayKey: `signup:${session.user.id}`,
      userId: session.user.id,
      occurredAt: session.user.joinedDate,
      countryCode: country?.countryCode ?? null,
      countrySource: country ? `${country.source}:first-seen-session` : null,
      metadata: { account_country: session.user.country || null },
    });
    // Cap the signed tier cookie at the beta expiry so an expired/revoked beta grant cannot outlive its window.
    const betaExpiry = session.user.betaAccess?.status === "active" ? session.user.betaAccess.betaExpiresAt : null;
    applyMembershipCookie(response, session.user.membershipTier, betaExpiry);
  } else {
    clearMembershipCookie(response);
  }

  return response;
}

export async function DELETE(request: Request) {
  if (!(await validateMemberCsrf(request))) {
    return NextResponse.json({ error: "Invalid CSRF token." }, { status: 403 });
  }

  const user = await getAuthenticatedSupabaseUser();
  if (user) {
    await recordSecurityEvent({
      userId: user.id,
      eventType: "auth.logout",
      outcome: "success",
    }).catch(() => undefined);
  }

  const supabase = await createSupabaseServerAuthClient();
  await supabase.auth.signOut();

  const response = NextResponse.json({ ok: true });
  clearMembershipCookie(response);
  return response;
}
