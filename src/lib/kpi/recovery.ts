import { getStore } from "@netlify/blobs";
import { KPI_SPOOL_STORE } from "@/lib/kpi/spool";
import type { KpiEventInsert } from "@/lib/kpi/repository";
import { writeReplayedKpiEvent } from "@/lib/kpi/replay-writer";
import { requireKpiReplayAuthorization } from "@/lib/kpi/replay-guardrails";

type StoredEvent = { row: KpiEventInsert };

export type KpiRecoveryReport = {
  attempted: number;
  recovered: number;
  failed: number;
  hasMore: boolean;
};

/**
 * Recover a bounded page of spooled KPI events. At-least-once delivery is safe
 * only after the replay_key unique index has been applied in Neon.
 *
 * This module intentionally does not expose an HTTP route or schedule.
 * An authenticated, explicitly enabled caller must invoke it.
 */
export async function recoverKpiSpool(limit = 25): Promise<KpiRecoveryReport> {
  requireKpiReplayAuthorization(process.env);
  const safeLimit = Number.isSafeInteger(limit) ? Math.max(1, Math.min(100, limit)) : 25;
  const store = getStore({ name: KPI_SPOOL_STORE, consistency: "strong" });
  let attempted = 0;
  let recovered = 0;
  let failed = 0;
  let hasMore = false;
  const page = await store.list({ prefix: "pending/" });
  {
    for (const entry of page.blobs) {
      if (attempted >= safeLimit) { hasMore = true; break; }
      attempted++;
      try {
        const payload = await store.get(entry.key, { type: "json" }) as StoredEvent | null;
        if (!payload?.row || !payload.row.event_name || !payload.row.site_id) {
          throw new Error("Invalid KPI spool event");
        }
        await writeReplayedKpiEvent(payload.row, entry.key);
        await store.delete(entry.key);
        recovered++;
      } catch (error) {
        failed++;
        console.error("KPI spool replay failed; retained for retry", entry.key, error);
      }
    }
    if (hasMore) break;
  }
  return { attempted, recovered, failed, hasMore: hasMore || page.blobs.length > safeLimit };
}
