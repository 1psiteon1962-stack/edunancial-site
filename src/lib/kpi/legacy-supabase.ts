import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { KpiEventInsert } from "@/lib/kpi/repository";

export async function insertLegacyKpiEvent(input: KpiEventInsert) {
  const { error } = await getSupabaseAdminClient().from("kpi_events").insert(input);
  if (error) throw error;
}

export async function listLegacyKpiEvents(limit: number) {
  const { data, error } = await getSupabaseAdminClient()
    .from("kpi_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}
