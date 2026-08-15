import { NextResponse } from "next/server";

import { requireAuthenticatedMember } from "@/lib/auth/server";
import { getUserSecuritySettings, listRecentSecurityEvents } from "@/lib/member/security";

export async function GET() {
  const auth = await requireAuthenticatedMember();
  if (!auth.ok) {
    return auth.response;
  }

  const settings = await getUserSecuritySettings(auth.session.user.id);
  const events = await listRecentSecurityEvents(auth.session.user.id, 10);

  return NextResponse.json({
    security: {
      email: auth.session.user.email,
      emailVerified: auth.session.user.emailVerified,
      pinEnabled: Boolean(settings.pin_hash),
      pinLockedUntil: settings.pin_locked_until,
      pinChangedAt: settings.pin_changed_at,
      failedPinAttempts: settings.pin_failed_attempts,
      lastSignInAt: auth.session.user.lastSignInAt,
      events: events.map((event) => ({
        id: event.id,
        eventType: event.event_type,
        outcome: event.outcome,
        createdAt: event.created_at,
        metadata: event.metadata,
      })),
      mfa: {
        totpSupported: false,
        passkeysSupported: false,
        configurationRequired: [
          "Enable and configure Supabase MFA/TOTP in the Supabase Auth console before exposing MFA enrollment.",
        ],
      },
    },
  });
}
