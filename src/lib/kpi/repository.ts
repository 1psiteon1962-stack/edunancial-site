import { getStore } from "@netlify/blobs";

import { getNeonSql } from "@/lib/db/neon";
import { insertLegacyKpiEvent, listLegacyKpiEvents } from "@/lib/kpi/legacy-supabase";
import { KPI_SPOOL_STORE, persistWithFallbacks } from "@/lib/kpi/spool";

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
  // Primary Neon -> legacy Supabase -> durable Netlify Blobs spool. An event is
  // never silently dropped; the spool is replayable once kpi_events exists.
  const outcome = await persistWithFallbacks(input, {
    primary: async (row) => {
      const sql = requireSql();
      const rows = await sql`
        insert into kpi_events (
          site_id, site_region, event_name, user_id, session_id, ip_hash, user_agent,
          path, referrer, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
          currency, value, sku, order_id, metadata
        ) values (
          ${row.site_id}, ${row.site_region}, ${row.event_name}, ${row.user_id}, ${row.session_id},
          ${row.ip_hash}, ${row.user_agent}, ${row.path}, ${row.referrer}, ${row.utm_source},
          ${row.utm_medium}, ${row.utm_campaign}, ${row.utm_term}, ${row.utm_content},
          ${row.currency}, ${row.value}, ${row.sku}, ${row.order_id}, ${JSON.stringify(row.metadata)}::jsonb
        )
        returning id, created_at
      `;
      return rows[0] ?? null;
    },
    fallback: insertLegacyKpiEvent,
    spool: () => getStore({ name: KPI_SPOOL_STORE, consistency: "strong" }),
  });
  return outcome;
}

export async function listRecentKpiEvents(limit = 50) {
  const safeLimit = Math.max(1, Math.min(200, Math.trunc(limit)));
  try {
    const sql = requireSql();
    return await sql`
      select *
      from kpi_events
      order by created_at desc, id desc
      limit ${safeLimit}
    `;
  } catch {
    return listLegacyKpiEvents(safeLimit);
  }
}
