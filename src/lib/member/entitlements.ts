import type { MembershipTier } from "@/lib/auth/types";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAuthConfig } from "@/lib/supabase/config";

function normalizeMembershipTier(planId: string | undefined): MembershipTier | null {
  switch (planId) {
    case "basic":
      return "basic";
    case "premium":
    case "pro":
      return "premium";
    case "enterprise":
    case "gold":
      return "enterprise";
    case "beta":
    case "trial":
      return "beta";
    case "free":
      return "free";
    default:
      return null;
  }
}

async function findUserIdByEmail(email: string): Promise<string | null> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) {
    throw new Error(`Unable to list auth users: ${error.message}`);
  }

  const match = data.users.find((user) => (user.email ?? "").toLowerCase() === email.toLowerCase());
  return match?.id ?? null;
}

export async function applyAuthoritativeMembershipEntitlement(input: {
  email: string;
  planId: string;
}) {
  if (!hasSupabaseAuthConfig()) {
    return;
  }

  const membershipTier = normalizeMembershipTier(input.planId);
  if (!membershipTier) {
    return;
  }

  const userId = await findUserIdByEmail(input.email);
  if (!userId) {
    return;
  }

  const admin = getSupabaseAdminClient();
  const { error } = await admin
    .from("user_profiles")
    .upsert({ user_id: userId, membership_tier: membershipTier }, { onConflict: "user_id", ignoreDuplicates: false });

  if (error) {
    throw new Error(`Unable to apply membership entitlement: ${error.message}`);
  }
}
