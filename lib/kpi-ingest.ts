export type KPIRecord = {
  timestamp: string;
  ip?: string;
  userAgent?: string;
  region?: string;
  level?: string;
  businessStage?: string;
};

export async function ingestKPI(data: KPIRecord) {
  // placeholder – safe no-op for now
  // later: write to DB, queue, or analytics pipeline
  if (process.env.NODE_ENV === "development") {
    console.log("KPI INGEST:", data);
  }

  return { ok: true };
}
