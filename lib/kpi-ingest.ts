// lib/kpi-ingest.ts

import { UserProfile } from "@/types/user";

/**
 * Normalizes raw KPI/user intake into a clean UserProfile object.
 * This prevents build-breaking shape mismatches.
 */
export function ingestUserProfile(input: Partial<UserProfile>): UserProfile {
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
