import { supabaseAdmin } from "@/lib/kpi/supabaseAdmin";
import { getSiteContext } from "@/lib/kpi/site";

type SiteContext = {
  site_id: string;
  site_region: string;
};

type InsertableKPIEventRow = {
  site_id: string;
  site_region: string;
  event_name: string;
  event_type?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
};

type WriteEventInput = {
  event_name: string;
  event_type?: string;
  metadata?: Record<string, unknown>;
};

export async function writeEvent(input: WriteEventInput) {
  // ✅ FIX: await the site context BEFORE accessing properties
  const site: SiteContext = await getSiteContext();

  const row: InsertableKPIEventRow = {
    site_id: site.site_id,
    site_region: site.site_region,
    event_name: input.event_name,
    event_type: input.event_type,
    metadata: input.metadata || {},
    created_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from("kpi_events")
    .insert([row]);

  if (error) {
    console.error("KPI write error:", error);
    throw error;
  }

  return { success: true };
}
