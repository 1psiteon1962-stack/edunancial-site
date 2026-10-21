import type { User } from "@supabase/supabase-js";

import { getNeonSql } from "@/lib/db/neon";
import { getNeonBetaGrant, type SqlClient } from "@/lib/member/neon-beta-codes";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export interface PersistentBetaAccess {
  status: "issued" | "active" | "expired" | "revoked";
  firstUsedAt: string | null;
  expiresAt: string | null;
  generation: number;
  reissueCount: number;
  source?: "neon" | "legacy" | "owner";
}

type LegacyLookup = (user: User) => Promise<PersistentBetaAccess | null>;

/**
 * Pre-Neon grants (Supabase beta_access_grants). Kept READ-ONLY as a
 * fallback so any tester who already holds a legacy grant keeps it; no new legacy grants are
 * created anywhere. Failures here never break sign-in.
 */
const legacyLookup: LegacyLookup = async (user) => {
  try {
    // READ-ONLY: never call activate_beta_access (it starts/changes legacy grants).
    // Only grants that are already active keep working; nothing new is activated.
    const admin = getSupabaseAdminClient();
    const { data, error } = await admin
      .from("beta_access_grants")
      .select("user_id,status,first_used_at,expires_at,generation,reissue_count")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();
    if (error || !data?.user_id) return null;
    return {
      status: "active",
      firstUsedAt: data.first_used_at ?? null,
      expiresAt: data.expires_at ?? null,
      generation: data.generation ?? 1,
      reissueCount: data.reissue_count ?? 0,
      source: "legacy",
    };
  } catch {
    return null;
  }
};

function normalizedEmail(value: string | null | undefined): string {
  return String(value ?? "").trim().toLowerCase();
}

/**
 * Permanent full access (all tracks, Levels 1-5, all languages) for the owner's own
 * member accounts: the configured owner and admin emails. Requires an email address the
 * auth provider has confirmed, so an unverified sign-up using the owner's address gets
 * nothing. Membership cookies stay bounded (24h) and are re-derived from this check.
 */
export function ownerMemberAccess(
  user: Pick<User, "email" | "email_confirmed_at">,
  env: Record<string, string | undefined> = process.env,
): PersistentBetaAccess | null {
  const email = normalizedEmail(user.email);
  if (!email || !user.email_confirmed_at) return null;
  const ownerEmails = [env.EDUNANCIAL_OWNER_EMAIL, env.EDUNANCIAL_ADMIN_EMAIL].map(normalizedEmail).filter(Boolean);
  if (!ownerEmails.includes(email)) return null;
  return {
    status: "active",
    firstUsedAt: null,
    expiresAt: "2099-12-31T23:59:59.000Z",
    generation: 1,
    reissueCount: 0,
    source: "owner",
  };
}

/**
 * Authoritative beta entitlement: the Neon beta_invite_codes row redeemed by this
 * server-verified account. Active/expired/revoked is decided by the database clock.
 */
export async function activateAndGetBetaAccess(
  user: User,
  deps: { neon?: SqlClient | null; legacy?: LegacyLookup } = {},
): Promise<PersistentBetaAccess | null> {
  const owner = ownerMemberAccess(user);
  if (owner) return owner;
  const sql = deps.neon !== undefined ? deps.neon : (getNeonSql() as unknown as SqlClient | null);
  if (sql) {
    try {
      const grant = await getNeonBetaGrant(sql, user.id);
      if (grant) {
        return {
          status: grant.revokedAt ? "revoked" : grant.active ? "active" : "expired",
          firstUsedAt: grant.redeemedAt,
          expiresAt: grant.expiresAt,
          generation: 1,
          reissueCount: 0,
          source: "neon",
        };
      }
    } catch (error) {
      // Fail closed for the entitlement (no beta access) but never block sign-in.
      // Do NOT fall through to the legacy store on a Neon error.
      console.error("[beta] Neon entitlement lookup failed", error instanceof Error ? error.message : String(error));
      return null;
    }
  }
  return (deps.legacy ?? legacyLookup)(user);
}

export function hasActiveBetaAccess(access: PersistentBetaAccess | null, now = Date.now()): boolean {
  return Boolean(
    access?.status === "active" &&
    access.expiresAt &&
    new Date(access.expiresAt).getTime() > now,
  );
}
