import { CanonicalKPIRecord } from "./types/canonical-kpi-record";

export function writeKPIRecord(
  record: CanonicalKPIRecord
): CanonicalKPIRecord {
  // This function intentionally does NOT update existing records.
  // Storage layer (DB, S3, warehouse) will only append.

  return Object.freeze(record);
}
