import type { User } from "@supabase/supabase-js";

import type { AuthUser, MembershipTier } from "@/lib/auth/types";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export interface UserProfileRow {
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  country: string | null;
  bio: string | null;
  membership_tier: MembershipTier;
  assessment_completed: boolean;
  overall_score: number | null;
  created_at: string;
  updated_at: string;
}

function getMetadataString(user: User, key: string): string {
  const value = user.user_metadata?.[key];
  return typeof value === "string" ? value : "";
}

export async function ensureUserProfile(user: User): Promise<UserProfileRow> {
  const admin = getSupabaseAdminClient();

  const payload = {
    user_id: user.id,
    first_name: getMetadataString(user, "first_name") || getMetadataString(user, "firstName"),
    last_name: getMetadataString(user, "last_name") || getMetadataString(user, "lastName"),
    phone: getMetadataString(user, "phone") || null,
    country: getMetadataString(user, "country") || null,
    bio: getMetadataString(user, "bio") || null,
  };

  const { data, error } = await admin
    .from("user_profiles")
    .upsert(payload, { onConflict: "user_id", ignoreDuplicates: false })
    .select("user_id, first_name, last_name, phone, country, bio, membership_tier, assessment_completed, overall_score, created_at, updated_at")
    .single();

  if (error || !data) {
    throw new Error(`Unable to ensure user profile: ${error?.message ?? "unknown error"}`);
  }

  return data as UserProfileRow;
}

export function mapAuthUser(user: User, profile: UserProfileRow): AuthUser {
  return {
    id: user.id,
    email: user.email ?? "",
    firstName: profile.first_name,
    lastName: profile.last_name,
    membershipTier: profile.membership_tier,
    joinedDate: user.created_at,
    country: profile.country ?? "",
    phone: profile.phone,
    bio: profile.bio,
    assessmentCompleted: profile.assessment_completed,
    overallScore: profile.overall_score,
    betaAccess: null,
    emailVerified: Boolean(user.email_confirmed_at),
    lastSignInAt: user.last_sign_in_at ?? null,
  };
}

export function sanitizeProfileUpdate(input: Partial<AuthUser>) {
  const result: Record<string, unknown> = {};

  if (typeof input.firstName === "string") result.first_name = input.firstName.slice(0, 100);
  if (typeof input.lastName === "string") result.last_name = input.lastName.slice(0, 100);
  if (typeof input.phone === "string") result.phone = input.phone.slice(0, 50) || null;
  if (typeof input.country === "string") result.country = input.country.slice(0, 100) || null;
  if (typeof input.bio === "string") result.bio = input.bio.slice(0, 1000) || null;
  if (typeof input.assessmentCompleted === "boolean") result.assessment_completed = input.assessmentCompleted;
  if (typeof input.overallScore === "number" || input.overallScore === null) {
    result.overall_score = input.overallScore;
  }

  return result;
}
