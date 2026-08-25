import type { User } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export interface PersistentBetaAccess {
  status: "issued" | "active" | "expired" | "revoked";
  firstUsedAt: string | null;
  expiresAt: string | null;
  generation: number;
  reissueCount: number;
}

export async function activateAndGetBetaAccess(user: User): Promise<PersistentBetaAccess | null> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.rpc("activate_beta_access", { p_user_id: user.id });
  if (error) {
    if (error.code === "PGRST202" || error.code === "42P01") return null;
    throw new Error(`Unable to resolve beta access: ${error.message}`);
  }
  if (!data) return null;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.user_id) return null;
  return {
    status: row.status,
    firstUsedAt: row.first_used_at ?? null,
    expiresAt: row.expires_at ?? null,
    generation: row.generation ?? 1,
    reissueCount: row.reissue_count ?? 0,
  };
}

export function hasActiveBetaAccess(access: PersistentBetaAccess | null, now = Date.now()): boolean {
  return Boolean(
    access?.status === "active" &&
    access.expiresAt &&
    new Date(access.expiresAt).getTime() > now,
  );
}
