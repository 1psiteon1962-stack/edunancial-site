import { NextResponse } from "next/server";

import { requireAuthenticatedMemberWrite } from "@/lib/auth/server";
import {
  getUserSecuritySettings,
  hashSecurityPin,
  recordSecurityEvent,
  requireRecentAuthentication,
  validateSecurityPin,
} from "@/lib/member/security";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

interface PinBody {
  pin?: string;
}

export async function POST(request: Request) {
  const auth = await requireAuthenticatedMemberWrite(request, "member-pin-set", "set");
  if (!auth.ok) {
    return auth.response;
  }
  const member = auth.session.user;
  if (!member) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  let body: PinBody;
  try {
    body = (await request.json()) as PinBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const pin = body.pin ?? "";
  const pinError = validateSecurityPin(pin);
  if (pinError) {
    return NextResponse.json({ error: pinError }, { status: 400 });
  }

  if (!requireRecentAuthentication(member.lastSignInAt ?? null)) {
    return NextResponse.json({ error: "Please sign in again before setting or changing your security PIN." }, { status: 403 });
  }

  const existing = await getUserSecuritySettings(member.id);
  const admin = getSupabaseAdminClient();
  const pinHash = hashSecurityPin(pin);
  const { error } = await admin
    .from("user_security_settings")
    .update({
      pin_hash: pinHash,
      pin_failed_attempts: 0,
      pin_locked_until: null,
      pin_changed_at: new Date().toISOString(),
      require_pin_for_sensitive_actions: true,
    })
    .eq("user_id", member.id);

  if (error) {
    return NextResponse.json({ error: "Unable to save PIN." }, { status: 500 });
  }

  await recordSecurityEvent({
    userId: member.id,
    eventType: existing.pin_hash ? "security.pin.changed" : "security.pin.created",
    outcome: "success",
  }).catch(() => undefined);

  return NextResponse.json({ ok: true, pinEnabled: true });
}
