// lib/kpi-ingest.ts
// Central intake validation for KPI data
// Does NOT store – only validates and normalizes

import type { UserProfileKPI } from "./kpi-types";

export function normalizeUserKPI(input: UserProfileKPI): UserProfileKPI {
  return {
    ...input,
    createdAt: new Date().toISOString(),
    qualifiedForAdvanced:
      input.currentLevel >= 4 && input.hasBusiness === true,
    investorCandidate:
      input.currentLevel === 5 && input.hasBusiness === true,
  };
}
