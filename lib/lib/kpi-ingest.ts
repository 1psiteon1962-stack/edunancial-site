// lib/lib/kpi-ingest.ts
// Internal-only validation & normalization layer
// Does NOT persist data — prepares it for storage

import type { UserProfileKPI } from "./kpi-types";

export function normalizeUserKPI(
  input: UserProfileKPI
): UserProfileKPI {
  return {
    ...input,
    createdAt: input.createdAt ?? new Date().toISOString(),
    startingLevel: Math.max(
      1,
      Math.min(5, input.startingLevel)
    ) as UserProfileKPI["startingLevel"],
    currentLevel: Math.max(
      input.startingLevel,
      Math.min(5, input.currentLevel)
    ) as UserProfileKPI["currentLevel"],
  };
}
