import type { PlanCode } from "@/types/plan";

/**
 * Returns true if the user's plan is included in the allowed plans.
 */
export function canAccess(
  plan: PlanCode,
  allowedPlans: readonly PlanCode[]
): boolean {
  return allowedPlans.includes(plan);
}
