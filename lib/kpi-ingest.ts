import type { UserProfileKPI } from "@/lib/kpi-types";

export type KPIRecord = {
  timestamp: string;
  ip?: string;
  userAgent?: string;
  region?: string;
  level?: string;
  businessStage?: string;
};

/**
 * Normalizes raw KPI input from the client into a safe,
 * internally consistent structure.
 *
 * This function is intentionally deterministic and side-effect free.
 */
export function normalizeUserKPI(input: UserProfileKPI): KPIRecord {
  return {
    timestamp: new Date().toISOString(),
    region: input.region ?? "unknown",
    level: input.level ?? "unassigned",
    businessStage: input.businessStage ?? "unspecified"
  };
}

/**
 * Ingests KPI data.
 * Currently a safe no-op placeholder.
 * Later: DB insert, queue publish, or analytics pipeline.
 */
export async function ingestKPI(record: KPIRecord) {
  if (process.env.NODE_ENV === "development") {
    console.log("KPI INGEST:", record);
  }

  return { ok: true };
}
