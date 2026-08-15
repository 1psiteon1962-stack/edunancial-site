import { NextResponse } from "next/server";

import {
  applyMembershipCookie,
  clearMembershipCookie,
  getAuthenticatedMemberSession,
  getAuthenticatedSupabaseUser,
} from "@/lib/auth/server";
import { validateMemberCsrf } from "@/lib/auth/csrf";
import { recordSecurityEvent } from "@/lib/member/security";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server-auth";

export async function GET() {
  const session = await getAuthenticatedMemberSession();
  const response = NextResponse.json(session);

  if (session.user) {
    applyMembershipCookie(response, session.user.membershipTier);
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
