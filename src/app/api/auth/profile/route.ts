import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updateMemberProfile, recordAuditEvent } from "@/lib/auth/memberService";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/auth/profile
 *
 * Updates the authenticated member's profile fields.
 * Only non-sensitive fields are accepted.
 */
export async function PATCH(request: NextRequest) {
  const session = await getSession();

  if (!session.isLoggedIn || !session.memberId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const allowed = ["firstName", "lastName", "country", "phone", "biography", "preferredLanguage", "preferredCurrency"];
  const updates: Record<string, string> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      updates[key] = String(body[key]);
    }
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const updated = await updateMemberProfile(session.memberId, updates);

  if (!updated) {
    return NextResponse.json({ success: false, error: "Profile update failed." }, { status: 500 });
  }

  await recordAuditEvent("profile.updated", {
    actor: session.email,
    memberId: session.memberId,
    ipAddress: ip,
    metadata: { fields: Object.keys(updates) },
  });

  return NextResponse.json({ success: true, member: {
    id: updated.id,
    email: updated.email,
    firstName: updated.firstName,
    lastName: updated.lastName,
    country: updated.country,
    phone: updated.phone,
    biography: updated.biography,
    preferredLanguage: updated.preferredLanguage,
    preferredCurrency: updated.preferredCurrency,
  }});
}
