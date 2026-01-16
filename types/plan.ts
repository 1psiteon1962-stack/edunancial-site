// types/plan.ts

export type PlanCode =
  | "free"
  | "starter"
  | "founder"
  | "pro"
  | "elite"
  | "enterprise";

/**
 * Normalize any incoming plan value to a valid PlanCode.
 * Defaults to "free".
 */
export function normalizePlan(
  plan: string | null | undefined
): PlanCode {
  switch (plan) {
    case "starter":
    case "founder":
    case "pro":
    case "elite":
    case "enterprise":
      return plan;
    case "free":
    default:
      return "free";
  }
}

/**
 * Canonical access comparison.
 * This exists because canAccess.ts EXPECTS it.
 */
const PLAN_ORDER: PlanCode[] = [
  "free",
  "starter",
  "founder",
  "pro",
  "elite",
  "enterprise",
];

export function hasAccess(
  userPlan: PlanCode,
  requiredPlan: PlanCode
): boolean {
  return (
    PLAN_ORDER.indexOf(userPlan) >=
    PLAN_ORDER.indexOf(requiredPlan)
  );
}
