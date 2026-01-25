// app/lib/plans.ts

export type PlanCode = "free" | "starter" | "pro" | "enterprise" | "growth";

/**
 * normalizePlan must accept null/undefined because session.user.planCode is optional.
 */
export function normalizePlan(plan: string | null | undefined): PlanCode {
  if (!plan) return "free";

  switch (plan.toLowerCase()) {
    case "starter":
      return "starter";
    case "pro":
      return "pro";
    case "enterprise":
      return "enterprise";
    case "growth":
      return "growth";
    case "free":
    default:
      return "free";
  }
}
