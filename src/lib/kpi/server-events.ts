import { getNeonSql } from "@/lib/db/neon";

/**
 * Server-side, idempotent KPI events recorded at authoritative points (not from
 * browser JSON). Each event carries a replay key, so the same business fact
 * (one signup per account, first completion of a lesson) is counted once even
 * if the call repeats. Append-only; never updates or deletes. Never throws.
 */
export type ServerKpiEvent = {
  eventName: "signup" | "lesson_start" | "lesson_complete";
  replayKey: string;
  userId: string;
  /** When the business fact happened (defaults to now). */
  occurredAt?: string | null;
  countryCode?: string | null;
  countrySource?: string | null;
  locale?: string | null;
  path?: string | null;
  metadata?: Record<string, unknown>;
};

export type ServerKpiOutcome = "inserted" | "duplicate" | "unavailable";

const seen = new Set<string>();
const SEEN_LIMIT = 10_000;

/** Pure: build the row so it can be tested without a database. */
export function buildServerKpiRow(event: ServerKpiEvent, siteRegion = "us") {
  const metadata: Record<string, unknown> = { ...(event.metadata ?? {}), source: "server" };
  if (event.countryCode && /^[A-Z]{2}$/.test(event.countryCode)) {
    metadata.visitor_country_code = event.countryCode;
    metadata.visitor_country_source = event.countrySource ?? "server";
  }
  if (event.locale) metadata.locale = event.locale;
  const occurred = event.occurredAt && Number.isFinite(Date.parse(event.occurredAt)) ? new Date(event.occurredAt).toISOString() : new Date().toISOString();
  return {
    created_at: occurred,
    site_id: "edunancial",
    site_region: siteRegion,
    event_name: event.eventName,
    user_id: event.userId,
    path: event.path ?? null,
    replay_key: event.replayKey,
    metadata,
  };
}

export async function recordServerKpiEventOnce(event: ServerKpiEvent): Promise<ServerKpiOutcome> {
  if (seen.has(event.replayKey)) return "duplicate";
  const sql = getNeonSql();
  if (!sql) return "unavailable";
  const row = buildServerKpiRow(event);
  try {
    const rows = await sql`
      insert into kpi_events (created_at, site_id, site_region, event_name, user_id, path, replay_key, metadata)
      values (${row.created_at}, ${row.site_id}, ${row.site_region}, ${row.event_name}, ${row.user_id}, ${row.path}, ${row.replay_key}, ${JSON.stringify(row.metadata)}::jsonb)
      on conflict (replay_key) where replay_key is not null do nothing
      returning id
    `;
    if (seen.size > SEEN_LIMIT) seen.clear();
    seen.add(event.replayKey);
    return rows.length ? "inserted" : "duplicate";
  } catch (error) {
    // Recorded again on the next authoritative call (idempotent), so a failure here loses nothing permanently.
    console.error("[kpi] server event failed", event.eventName, error instanceof Error ? error.message : String(error));
    return "unavailable";
  }
}
