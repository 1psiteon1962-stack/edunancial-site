import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient<any> | null = null;

export function getKpiSupabaseAdmin(): SupabaseClient<any> {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) {
    throw new Error("KPI data source unavailable: Supabase admin configuration is incomplete.");
  }

  cached = createClient<any>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  return cached;
}
