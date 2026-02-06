// src/app/lib/plans.ts

/**
 * Allowed subscription / access plans
 */
export type PlanCode =
  | "free"
  | "starter"
  | "pro"
  | "builder"
  | "enterprise";

/**
 * Normalize any incoming plan string
 */
export function normalizePlan(
  plan?: string | null
): PlanCode {
  if (!plan) return "free";

  const p = plan.toLowerCase();

  if (p === "starter") return "starter";
  if (p === "pro") return "pro";
  if (p === "builder") return "builder";
  if (p === "enterprise") return "enterprise";

  return "free";
}

/**
 * Capital-level access check
 */
export function hasCapitalAccess(plan: PlanCode): boolean {
  return plan === "pro" || plan === "builder" || plan === "enterprise";
}
