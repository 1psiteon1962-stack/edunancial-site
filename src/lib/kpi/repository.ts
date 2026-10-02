import { getNeonSql } from "@/lib/db/neon";

export type KpiEventInsert = {
  site_id: string;
  site_region: string;
  event_name: string;
  user_id: string | null;
  session_id: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  path: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  currency: string | null;
  value: number | null;
  sku: string | null;
  order_id: string | null;
  metadata: Record<string, unknown>;
};

function requireSql() {
  const sql = getNeonSql();
  if (!sql) throw new Error("KPI database is not configured.");
  return sql;
}

export async function insertKpiEvent(input: KpiEventInsert) {
  const sql = requireSql();
  const rows = await sql`
    insert into kpi_events (
      site_id, site_region, event_name, user_id, session_id, ip_hash, user_agent,
      path, referrer, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
      currency, value, sku, order_id, metadata
    ) values (
      ${input.site_id}, ${input.site_region}, ${input.event_name}, ${input.user_id}, ${input.session_id},
      ${input.ip_hash}, ${input.user_agent}, ${input.path}, ${input.referrer}, ${input.utm_source},
      ${input.utm_medium}, ${input.utm_campaign}, ${input.utm_term}, ${input.utm_content},
      ${input.currency}, ${input.value}, ${input.sku}, ${input.order_id}, ${JSON.stringify(input.metadata)}::jsonb
    )
    returning id, created_at
  `;
  return rows[0] ?? null;
}

export async function listRecentKpiEvents(limit = 50) {
  const sql = requireSql();
  const safeLimit = Math.max(1, Math.min(200, Math.trunc(limit)));
  return sql`
    select *
    from kpi_events
    order by created_at desc, id desc
    limit ${safeLimit}
  `;
}
