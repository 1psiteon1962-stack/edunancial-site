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
  source?: "neon" | "legacy";
}

type LegacyLookup = (user: User) => Promise<PersistentBetaAccess | null>;

/**
 * Pre-Neon grants (Supabase beta_access_grants via activate_beta_access). Kept READ-ONLY as a
 * fallback so any tester who already holds a legacy grant keeps it; no new legacy grants are
 * created anywhere. Failures here never break sign-in.
 */
const legacyLookup: LegacyLookup = async (user) => {
  try {
    const admin = getSupabaseAdminClient();
    const { data, error } = await admin.rpc("activate_beta_access", { p_user_id: user.id });
    if (error || !data) return null;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.user_id) return null;
    return {
      status: row.status,
      firstUsedAt: row.first_used_at ?? null,
      expiresAt: row.expires_at ?? null,
      generation: row.generation ?? 1,
      reissueCount: row.reissue_count ?? 0,
      source: "legacy",
    };
  } catch {
    return null;
  }
};

/**
 * Authoritative beta entitlement: the Neon beta_invite_codes row redeemed by this
 * server-verified account. Active/expired/revoked is decided by the database clock.
 */
export async function activateAndGetBetaAccess(
  user: User,
  deps: { neon?: SqlClient | null; legacy?: LegacyLookup } = {},
): Promise<PersistentBetaAccess | null> {
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
      console.error("[beta] Neon entitlement lookup failed", error instanceof Error ? error.message : String(error));
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
