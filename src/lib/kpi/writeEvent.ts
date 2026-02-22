import type { KPIEvent, InsertableKPIEventRow } from "./types";
import { supabaseAdmin } from "./supabaseAdmin";
import { getSiteContext } from "./site";

export type RequestContext = {
  ip_hash: string | null;
  user_agent: string | null;
};

function normalizeUtm(url: URL) {
  const p = url.searchParams;
  return {
    utm_source: p.get("utm_source"),
    utm_medium: p.get("utm_medium"),
    utm_campaign: p.get("utm_campaign"),
    utm_term: p.get("utm_term"),
    utm_content: p.get("utm_content"),
  };
}

export async function writeKPIEvent(input: KPIEvent, ctx: RequestContext) {
  const site = getSiteContext();

  const metadata = input.metadata ?? {};
  const path = input.path ?? null;

  // If path wasn’t supplied, attempt to infer from metadata.url if provided.
  let inferredPath: string | null = path;
  let utm = {
    utm_source: input.utm_source ?? null,
    utm_medium: input.utm_medium ?? null,
    utm_campaign: input.utm_campaign ?? null,
    utm_term: input.utm_term ?? null,
    utm_content: input.utm_content ?? null,
  };

  if (!inferredPath && typeof metadata["url"] === "string") {
    try {
      const u = new URL(metadata["url"]);
      inferredPath = u.pathname;
      const fromUrl = normalizeUtm(u);
      utm = {
        utm_source: utm.utm_source ?? fromUrl.utm_source ?? null,
        utm_medium: utm.utm_medium ?? fromUrl.utm_medium ?? null,
        utm_campaign: utm.utm_campaign ?? fromUrl.utm_campaign ?? null,
        utm_term: utm.utm_term ?? fromUrl.utm_term ?? null,
        utm_content: utm.utm_content ?? fromUrl.utm_content ?? null,
      };
    } catch {
      // ignore URL parse errors
    }
  }

  const row: InsertableKPIEventRow = {
    site_id: site.site_id,
    site_region: site.site_region,
    event_name: input.event_name,

    user_id: input.user_id ?? null,
    session_id: input.session_id ?? null,

    ip_hash: ctx.ip_hash,
    user_agent: ctx.user_agent,

    path: inferredPath,
    referrer: input.referrer ?? null,

    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    utm_term: utm.utm_term,
    utm_content: utm.utm_content,

    currency: input.currency ?? null,
    value: typeof input.value === "number" ? input.value : null,
    sku: input.sku ?? null,
    order_id: input.order_id ?? null,

    metadata,
  };

  const { error } = await supabaseAdmin.from("kpi_events").insert(row);
  if (error) {
    throw new Error(`Failed to insert KPI event: ${error.message}`);
  }
}
