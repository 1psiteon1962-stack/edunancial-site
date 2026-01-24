// lib/kpi-ingest.ts

import { UserProfile } from "@/types/user";

/**
 * Canonical normalization step for KPI + user ingestion.
 * This is the function expected by kpi-pipeline.ts.
 */
export function normalizeUserKPI(
  input: Partial<UserProfile>
): UserProfile {
  return {
    userId: input.userId ?? "anonymous",

    createdAt: input.createdAt
      ? new Date(input.createdAt)
      : new Date(),

    firstName: input.firstName ?? "",
    lastName: input.lastName ?? "",

    email: input.email,

    plan: input.plan ?? "free",

    lastActiveAt: input.lastActiveAt
      ? new Date(input.lastActiveAt)
      : new Date(),
  };
}

/**
 * Backwards-compatible alias (if other files still call this).
 */
export function ingestUserProfile(
  input: Partial<UserProfile>
): UserProfile {
  return normalizeUserKPI(input);
}
