import { normalizeUserKPI } from "./kpi-ingest";
import { writeKPIRecord } from "./kpi-ledger";
import type { CanonicalKPIRecord } from "./types/canonical-kpi-record";

export function buildKPIRecord(
  input: any,
  source: "web" | "api" | "admin"
): CanonicalKPIRecord {
  const user = normalizeUserKPI(input);

  const record: CanonicalKPIRecord = {
    recordId: crypto.randomUUID(),
    user,
    investor: {
      acquisitionChannel: input.acquisitionChannel ?? "unknown",
      engagementLevel: input.engagementLevel ?? "low",
      monetizationStatus: input.monetizationStatus ?? "free",

      completedDiagnostic: !!input.completedDiagnostic,
      timeToFirstActionDays: input.timeToFirstActionDays,
      cohortMonth: new Date().toISOString().slice(0, 7),
      isRepeatUser: !!input.isRepeatUser,
    },
    createdAt: new Date().toISOString(),
    source,
    version: 1,
  };

  return writeKPIRecord(record);
}
