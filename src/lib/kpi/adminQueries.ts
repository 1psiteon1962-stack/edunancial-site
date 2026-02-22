import { supabaseAdmin } from "./supabaseAdmin";

export type AdminKPIFilters = {
  site_region?: string | null;
  site_id?: string | null;
  days?: number;
};

export async function getKPIOverview(filters: AdminKPIFilters) {
  const days = filters.days ?? 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  // Fetch last N days events, then aggregate in JS (safe for early stage).
  // When volume grows, replace with SQL views/materialized views.
  let q = supabaseAdmin
    .from("kpi_events")
    .select("event_name, value, currency, created_at, site_id, site_region")
    .gte("created_at", since);

  if (filters.site_region) q = q.eq("site_region", filters.site_region);
  if (filters.site_id) q = q.eq("site_id", filters.site_id);

  const { data, error } = await q;
  if (error) throw new Error(error.message);

  const rows = data ?? [];

  const countByEvent: Record<string, number> = {};
  let revenue = 0;

  for (const r of rows) {
    countByEvent[r.event_name] = (countByEvent[r.event_name] || 0) + 1;
    if (r.event_name === "purchase_success" && typeof r.value === "number") {
      revenue += r.value;
    }
  }

  const beginCheckout = countByEvent["begin_checkout"] || 0;
  const purchases = countByEvent["purchase_success"] || 0;
  const conversion = beginCheckout > 0 ? purchases / beginCheckout : 0;

  return {
    since,
    total_events: rows.length,
    revenue,
    purchases,
    beginCheckout,
    conversion,
    countByEvent,
  };
}

export async function listSites() {
  // Get distinct (site_id, site_region)
  const { data, error } = await supabaseAdmin
    .from("kpi_events")
    .select("site_id, site_region")
    .order("site_region", { ascending: true })
    .limit(5000);

  if (error) throw new Error(error.message);

  const uniq = new Map<string, { site_id: string; site_region: string }>();
  for (const r of data ?? []) {
    const key = `${r.site_region}::${r.site_id}`;
    uniq.set(key, { site_id: r.site_id, site_region: r.site_region });
  }
  return Array.from(uniq.values());
}

export async function fetchEventsCSV(filters: AdminKPIFilters) {
  const days = filters.days ?? 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  let q = supabaseAdmin
    .from("kpi_events")
    .select(
      "created_at,site_region,site_id,event_name,user_id,session_id,path,referrer,utm_source,utm_medium,utm_campaign,utm_term,utm_content,currency,value,sku,order_id,metadata"
    )
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(20000);

  if (filters.site_region) q = q.eq("site_region", filters.site_region);
  if (filters.site_id) q = q.eq("site_id", filters.site_id);

  const { data, error } = await q;
  if (error) throw new Error(error.message);

  const rows = data ?? [];

  const header = [
    "created_at",
    "site_region",
    "site_id",
    "event_name",
    "user_id",
    "session_id",
    "path",
    "referrer",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "currency",
    "value",
    "sku",
    "order_id",
    "metadata_json",
  ].join(",");

  const lines = rows.map((r) => {
    const esc = (v: any) => {
      if (v === null || v === undefined) return "";
      const s = typeof v === "string" ? v : JSON.stringify(v);
      const safe = s.replaceAll('"', '""');
      return `"${safe}"`;
    };

    return [
      esc(r.created_at),
      esc(r.site_region),
      esc(r.site_id),
      esc(r.event_name),
      esc(r.user_id),
      esc(r.session_id),
      esc(r.path),
      esc(r.referrer),
      esc(r.utm_source),
      esc(r.utm_medium),
      esc(r.utm_campaign),
      esc(r.utm_term),
      esc(r.utm_content),
      esc(r.currency),
      esc(r.value),
      esc(r.sku),
      esc(r.order_id),
      esc(r.metadata),
    ].join(",");
  });

  return [header, ...lines].join("\n");
}
