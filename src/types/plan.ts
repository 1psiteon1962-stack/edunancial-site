// src/types/plan.ts

/**
 * Subscription / access plan codes (single source of truth)
 */
export type PlanCode = "starter" | "pro" | "builder" | "enterprise";

/**
 * Normalize any incoming plan string into a valid PlanCode.
 */
export function normalizePlan(input: string | null | undefined): PlanCode {
  const value = (input ?? "").toLowerCase().trim();

  if (value === "pro") return "pro";
  if (value === "builder") return "builder";
  if (value === "enterprise") return "enterprise";

  // Default fallback
  return "starter";
}
