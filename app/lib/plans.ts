// app/lib/plans.ts
// Single source of truth for ALL plan codes used across the site.

export type PlanCode =
  | "free"
  | "starter"
  | "growth"
  | "builder"
  | "pro"
  | "enterprise"
  | "elite";

/**
 * Normalize any incoming string into a valid PlanCode.
 * Unknown values always fall back to "free".
 */
export function normalizePlan(value: string): PlanCode {
  const v = value.trim().toLowerCase();

  if (v === "free") return "free";
  if (v === "starter") return "starter";
  if (v === "growth") return "growth";
  if (v === "builder") return "builder";
  if (v === "pro") return "pro";
  if (v === "enterprise") return "enterprise";
  if (v === "elite") return "elite";

  return "free";
}

/**
 * Plan ranking for AccessGate comparisons.
 */
export const PLAN_ORDER: Record<PlanCode, number> = {
  free: 0,
  starter: 1,
  growth: 2,
  builder: 3,
  pro: 4,
  enterprise: 5,
  elite: 6,
};

/**
 * Returns true if the userPlan satisfies or exceeds the requiredPlan.
 */
export function hasAccess(userPlan: PlanCode, requiredPlan: PlanCode): boolean {
  return PLAN_ORDER[userPlan] >= PLAN_ORDER[requiredPlan];
}
