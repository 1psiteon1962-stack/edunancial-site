// lib/kpi-pipeline.ts

import { normalizeUserKPI } from "./kpi-ingest";
import { writeKPIRecord } from "./kpi-ledger";
import type { CanonicalKPIRecord } from "./types/canonical-kpi-record";

/**
 * Main KPI pipeline entry.
 * Normalizes raw input → writes canonical KPI record.
 */
export async function runKpiPipeline(
  rawInput: any
): Promise<CanonicalKPIRecord> {
  const user = normalizeUserKPI(rawInput);

  const record: CanonicalKPIRecord = {
    userId: user.userId,
    plan: user.plan ?? "free",
    createdAt: user.createdAt ?? new Date(),
    lastActiveAt: user.lastActiveAt ?? new Date(),
  };

  await writeKPIRecord(record);

  return record;
}
