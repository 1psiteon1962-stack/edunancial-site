// app/lib/plans.ts

/**
 * All valid subscription tiers in the platform.
 * This file is the SINGLE SOURCE OF TRUTH for plans.
 */
export type PlanCode =
  | "free"
  | "starter"
  | "growth"
  | "pro"
  | "elite"
  | "enterprise";

/**
 * Canonical plan ordering (lowest → highest).
 * Access is granted if userPlan >= requiredPlan.
 */
export const PLAN_ORDER: PlanCode[] = [
  "free",
  "starter",
  "growth",
  "pro",
  "elite",
  "enterprise",
];

/**
 * Normalize any incoming plan string into a valid PlanCode.
 * Defaults to "free" if unknown.
 */
export function normalizePlan(value: string): PlanCode {
  const v = value.trim().toLowerCase();

  if (v === "starter") return "starter";
  if (v === "growth") return "growth";
  if (v === "pro") return "pro";
  if (v === "elite") return "elite";
  if (v === "enterprise") return "enterprise";

  return "free";
}

/**
 * Returns true if the userPlan meets or exceeds the requiredPlan.
 */
export function planAllowsAccess(
  userPlan: PlanCode,
  requiredPlan: PlanCode
): boolean {
  return (
    PLAN_ORDER.indexOf(userPlan) >= PLAN_ORDER.indexOf(requiredPlan)
  );
}
