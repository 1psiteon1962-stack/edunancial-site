import { NextResponse } from "next/server";

import { getRequestRateLimitKey, enforceMemberRateLimit } from "@/lib/auth/rate-limit";
import { requireAuthenticatedMemberWrite } from "@/lib/auth/server";
import {
  computePinFailureState,
  getUserSecuritySettings,
  isPinLocked,
  recordSecurityEvent,
  verifySecurityPinHash,
} from "@/lib/member/security";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

interface PinVerifyBody {
  pin?: string;
}

export async function POST(request: Request) {
  const auth = await requireAuthenticatedMemberWrite(request, "member-pin-verify", "verify");
  if (!auth.ok) {
    return auth.response;
  }
  const member = auth.session.user;
  if (!member) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const rateLimit = enforceMemberRateLimit(
    getRequestRateLimitKey("member-pin-verify-hard", request, member.id),
    10,
    60_000,
  );
  if (!rateLimit.allowed) {
    const response = NextResponse.json({ error: "Too many PIN verification attempts." }, { status: 429 });
    response.headers.set("Retry-After", Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString());
    return response;
  }

  let body: PinVerifyBody;
  try {
    body = (await request.json()) as PinVerifyBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const settings = await getUserSecuritySettings(member.id);
  if (!settings.pin_hash) {
    return NextResponse.json({ error: "Security PIN is not enabled." }, { status: 404 });
  }
  if (isPinLocked(settings)) {
    await recordSecurityEvent({
      userId: member.id,
      eventType: "security.pin.lockout",
      outcome: "blocked",
    }).catch(() => undefined);
    return NextResponse.json({ error: "Security PIN is temporarily locked.", lockedUntil: settings.pin_locked_until }, { status: 423 });
  }

  const valid = verifySecurityPinHash(body.pin ?? "", settings.pin_hash);
  const admin = getSupabaseAdminClient();

  if (!valid) {
    const failureState = computePinFailureState(settings.pin_failed_attempts);
    await admin
      .from("user_security_settings")
      .update({
        pin_failed_attempts: failureState.failedAttempts,
        pin_locked_until: failureState.lockedUntil,
      })
      .eq("user_id", member.id);

    await recordSecurityEvent({
      userId: member.id,
      eventType: failureState.locked ? "security.pin.lockout" : "security.pin.verify_failed",
      outcome: failureState.locked ? "blocked" : "failure",
      metadata: { failedAttempts: failureState.failedAttempts },
    }).catch(() => undefined);

    return NextResponse.json({ error: failureState.locked ? "Security PIN is temporarily locked." : "Invalid security PIN.", lockedUntil: failureState.lockedUntil }, { status: failureState.locked ? 423 : 400 });
  }

  await admin
    .from("user_security_settings")
    .update({
      pin_failed_attempts: 0,
      pin_locked_until: null,
    })
    .eq("user_id", member.id);

  await recordSecurityEvent({
    userId: member.id,
    eventType: "security.pin.verified",
    outcome: "success",
  }).catch(() => undefined);

  return NextResponse.json({ ok: true, verified: true });
}
