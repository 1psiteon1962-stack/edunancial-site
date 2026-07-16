/**
 * Server-side entitlement service.
 *
 * Determines what a member has access to based on verified server-side records.
 * Never trusts:
 *  - query string success values
 *  - client-side checkout state
 *  - localStorage membership values
 *  - browser-supplied payment IDs
 *
 * Import only in server-side code (API routes, server components).
 */

import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/db/supabase";
import { type Member } from "@/lib/auth/memberService";

// ============================================================
// TYPES
// ============================================================

export interface MemberEntitlements {
  memberId: string;
  membershipTier: string;
  membershipStatus: string;
  isActive: boolean;
  isBeta: boolean;
  betaExpiresAt: string | null;
  hasPaidAccess: boolean;
  accessibleCourses: string[];    // course IDs, empty = all for tier
  accessibleBooks: string[];      // book IDs, empty = all for tier
  accessibleAcademyLevels: number[];
  certificates: string[];
  promotionalAccess: boolean;
  gracePeriodEndsAt: string | null;
  cancelledAt: string | null;
  expiresAt: string | null;
}

// Tier-level access rules (server-controlled, never from localStorage)
const TIER_ACADEMY_LEVELS: Record<string, number[]> = {
  free: [],
  basic: [1],
  premium: [1, 2, 3],
  enterprise: [1, 2, 3, 4, 5],
  beta: [1, 2, 3, 4, 5],
};

// ============================================================
// ENTITLEMENT RESOLUTION
// ============================================================

export async function resolveMemberEntitlements(
  member: Member,
): Promise<MemberEntitlements> {
  const isBetaActive = await checkBetaAccess(member.id, member.email);
  const activeTier = isBetaActive ? "beta" : member.membershipTier;

  const isActive =
    member.membershipStatus === "active" ||
    member.membershipStatus === "trial" ||
    member.membershipStatus === "grace_period" ||
    isBetaActive;

  const hasPaidAccess = activeTier !== "free" && isActive;

  const accessibleAcademyLevels = TIER_ACADEMY_LEVELS[activeTier] ?? [];

  // Load explicit access grants (e.g. manual overrides, promotional)
  const explicitAccess = await loadExplicitAccess(member.id);

  return {
    memberId: member.id,
    membershipTier: activeTier,
    membershipStatus: member.membershipStatus,
    isActive,
    isBeta: isBetaActive,
    betaExpiresAt: explicitAccess.betaExpiresAt,
    hasPaidAccess,
    accessibleCourses: explicitAccess.courses,
    accessibleBooks: explicitAccess.books,
    accessibleAcademyLevels: [
      ...new Set([...accessibleAcademyLevels, ...explicitAccess.academyLevels]),
    ].sort((a, b) => a - b),
    certificates: explicitAccess.certificates,
    promotionalAccess: explicitAccess.promotional,
    gracePeriodEndsAt: member.membershipStatus === "grace_period" ? null : null,
    cancelledAt: member.membershipStatus === "cancelled" ? member.updatedAt : null,
    expiresAt: null,
  };
}

// ============================================================
// BETA ACCESS CHECK
// ============================================================

async function checkBetaAccess(memberId: string, email: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const db = getSupabaseAdmin();
    const normalized = email.trim().toLowerCase();

    const { data } = await db
      .from("beta_invitations")
      .select("status, beta_expires_at")
      .or("member_id.eq." + memberId + ",approved_email_normalized.eq." + normalized)
      .eq("status", "active")
      .single();

    if (!data) return false;

    const row = data as Record<string, unknown>;
    const expiresAt = row.beta_expires_at as string | null;

    if (expiresAt && new Date(expiresAt) < new Date()) return false;
    return true;
  } catch {
    return false;
  }
}

// ============================================================
// EXPLICIT ACCESS GRANTS
// ============================================================

interface ExplicitAccess {
  courses: string[];
  books: string[];
  academyLevels: number[];
  certificates: string[];
  promotional: boolean;
  betaExpiresAt: string | null;
}

async function loadExplicitAccess(memberId: string): Promise<ExplicitAccess> {
  const result: ExplicitAccess = {
    courses: [],
    books: [],
    academyLevels: [],
    certificates: [],
    promotional: false,
    betaExpiresAt: null,
  };

  if (!isSupabaseConfigured()) return result;

  try {
    const db = getSupabaseAdmin();
    const now = new Date().toISOString();

    const { data } = await db
      .from("member_access")
      .select("access_type, resource_id, expires_at, metadata")
      .eq("member_id", memberId)
      .is("revoked_at", null)
      .or("expires_at.is.null,expires_at.gt." + now);

    if (!data) return result;

    for (const row of data as Record<string, unknown>[]) {
      const type = row.access_type as string;
      const resourceId = row.resource_id as string | null;

      switch (type) {
        case "course":
          if (resourceId) result.courses.push(resourceId);
          break;
        case "book":
          if (resourceId) result.books.push(resourceId);
          break;
        case "academy_level":
          if (resourceId) result.academyLevels.push(parseInt(resourceId, 10));
          break;
        case "certificate":
          if (resourceId) result.certificates.push(resourceId);
          break;
        case "promo":
          result.promotional = true;
          break;
        case "beta":
          result.betaExpiresAt = (row.expires_at as string | null) ?? null;
          break;
      }
    }
  } catch {
    // Return empty access rather than throwing
  }

  return result;
}

// ============================================================
// PAYMENT WEBHOOK ENTITLEMENT UPDATE
// ============================================================

/**
 * Update a member's membership tier and status based on a verified payment event.
 * Called ONLY from verified webhook handlers — never from client-facing routes.
 */
export async function grantMembershipFromPayment(opts: {
  paymentCustomerId: string;
  paymentProvider: string;
  subscriptionId: string;
  tier: string;
  status: string;
}): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const db = getSupabaseAdmin();

    const { error } = await db
      .from("members")
      .update({
        membership_tier: opts.tier,
        membership_status: opts.status,
        payment_provider: opts.paymentProvider,
        payment_subscription_id: opts.subscriptionId,
        updated_at: new Date().toISOString(),
      })
      .eq("payment_customer_id", opts.paymentCustomerId)
      .eq("payment_provider", opts.paymentProvider);

    return !error;
  } catch {
    return false;
  }
}
