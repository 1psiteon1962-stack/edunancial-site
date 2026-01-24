// lib/kpi-pipeline.ts

import { normalizeUserKPI } from "./kpi-ingest";
import { writeKPIRecord } from "./kpi-ledger";
import type { CanonicalKPIRecord } from "./types/canonical-kpi-record";

/**
 * Main KPI pipeline entry.
 * Normalizes raw input → writes canonical KPI record.
 *
 * IMPORTANT:
 * CanonicalKPIRecord expects timestamps as STRINGS, not Date objects.
 */
export async function runKpiPipeline(
  rawInput: any
): Promise<CanonicalKPIRecord> {
  const user = normalizeUserKPI(rawInput);

  const createdAtISO =
    (user.createdAt ?? new Date()).toISOString();

  const lastActiveAtISO =
    (user.lastActiveAt ?? new Date()).toISOString();

  const record: CanonicalKPIRecord = {
    userId: user.userId,
    plan: user.plan ?? "free",

    // FIX: must be string, not Date
    createdAt: createdAtISO,
    lastActiveAt: lastActiveAtISO,
  };

  await writeKPIRecord(record);

  return record;
}
