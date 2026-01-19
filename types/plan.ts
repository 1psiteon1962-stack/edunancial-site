// types/plan.ts

export type PlanCode =
  | "free"
  | "starter"
  | "founder"
  | "pro"
  | "enterprise";

/**
 * Normalizes any incoming plan value into a valid PlanCode.
 * Defaults to "free" if unknown or missing.
 */
export function normalizePlan(plan?: string | null): PlanCode {
  switch (plan?.toLowerCase()) {
    case "starter":
      return "starter";
    case "founder":
      return "founder";
    case "pro":
      return "pro";
    case "enterprise":
      return "enterprise";
    case "free":
    default:
      return "free";
  }
}
