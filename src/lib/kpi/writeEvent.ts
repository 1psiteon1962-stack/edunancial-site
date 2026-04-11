import { supabaseAdmin } from "@/lib/kpi/supabaseAdmin";
import { getSiteContext, SiteContext } from "@/lib/site-context";
import type { InsertableKPIEventRow } from "@/lib/kpi/types";

type WriteEventInput = {
  event_name: string;
  event_type?: string;
  metadata?: Record<string, unknown>;
};

export async function writeEvent(input: WriteEventInput) {
  // ✅ FIX: unified SiteContext (no conflicting types anymore)
  const site: SiteContext = await getSiteContext();

  const row: InsertableKPIEventRow = {
    site_id: site.site_id,
    site_region: site.site_region,
    event_name: input.event_name,
    event_type: input.event_type,

    user_id: null,
    session_id: null,

    ip_hash: null,
    user_agent: null,

    path: null,
    referrer: null,

    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,

    currency: null,
    value: null,
    sku: null,
    order_id: null,

    metadata: input.metadata || {},
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
