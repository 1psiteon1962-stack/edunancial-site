import { getNeonSql } from "@/lib/db/neon";
import type { KpiEventInsert } from "@/lib/kpi/repository";

/**
 * Replay writer for the unique replay_key schema introduced in Q1 #1299.
 * Requires db/neon/20261018_kpi_replay_idempotency.sql to be applied first.
 * Do not schedule replay until the migration is applied and verified.
 */
export async function writeReplayedKpiEvent(row: KpiEventInsert, replayKey: string) {
  if (!replayKey.startsWith("pending/") || !replayKey.endsWith(".json")) {
    throw new Error("Invalid KPI replay key");
  }
  const sql = getNeonSql();
  if (!sql) throw new Error("KPI database is not configured");
  await sql`
    insert into kpi_events (
      replay_key, site_id, site_region, event_name, user_id, session_id,
      ip_hash, user_agent, path, referrer, utm_source, utm_medium,
      utm_campaign, utm_term, utm_content, currency, value, sku, order_id, metadata
    ) values (
      ${replayKey}, ${row.site_id}, ${row.site_region}, ${row.event_name},
      ${row.user_id}, ${row.session_id}, ${row.ip_hash}, ${row.user_agent},
      ${row.path}, ${row.referrer}, ${row.utm_source}, ${row.utm_medium},
      ${row.utm_campaign}, ${row.utm_term}, ${row.utm_content},
      ${row.currency}, ${row.value}, ${row.sku}, ${row.order_id},
      ${JSON.stringify(row.metadata)}::jsonb
    )
    on conflict (replay_key) where replay_key is not null do nothing
  `;
}
