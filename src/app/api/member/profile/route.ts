import { NextResponse } from "next/server";

import type { AuthUser } from "@/lib/auth/types";
import { requireAuthenticatedMember, requireAuthenticatedMemberWrite } from "@/lib/auth/server";
import { ensureUserProfile, mapAuthUser, sanitizeProfileUpdate } from "@/lib/member/profile";
import { recordSecurityEvent } from "@/lib/member/security";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server-auth";

export async function GET() {
  const auth = await requireAuthenticatedMember();
  if (!auth.ok) {
    return auth.response;
  }
  if (!auth.session.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  return NextResponse.json({ user: auth.session.user });
}

export async function PATCH(request: Request) {
  const auth = await requireAuthenticatedMemberWrite(request, "member-profile-update", "profile");
  if (!auth.ok) {
    return auth.response;
  }

  const user = await getSupabaseUserOrThrow();
  await ensureUserProfile(user);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const updates = sanitizeProfileUpdate(body as Partial<AuthUser>);
  const supabase = await createSupabaseServerAuthClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("user_id", user.id)
    .select("user_id, first_name, last_name, phone, country, bio, membership_tier, assessment_completed, overall_score, created_at, updated_at")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Unable to update profile." }, { status: 400 });
  }

  await recordSecurityEvent({
    userId: user.id,
    eventType: "profile.updated",
    outcome: "success",
    metadata: { fields: Object.keys(updates) },
  }).catch(() => undefined);

  return NextResponse.json({ user: mapAuthUser(user, data) });
}

async function getSupabaseUserOrThrow() {
  const supabase = await createSupabaseServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Authentication required.");
  }
  return user;
}
