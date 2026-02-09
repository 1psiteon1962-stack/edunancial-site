// src/app/lib/plans.ts

/**
 * Allowed subscription / access plans
 * (Must include every plan referenced anywhere in the app)
 */
export type PlanCode =
  | "free"
  | "starter"
  | "pro"
  | "builder"
  | "elite"
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
  if (p === "elite") return "elite";
  if (p === "enterprise") return "enterprise";

  return "free";
}

/**
 * Capital-level access check
 */
export function hasCapitalAccess(plan: PlanCode): boolean {
  return plan === "pro" || plan === "builder" || plan === "elite" || plan === "enterprise";
}
