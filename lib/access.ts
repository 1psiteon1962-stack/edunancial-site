import type { PlanTier, PlanCode } from "@/types/plan";
import { PLANS } from "@/types/plan";

export const DEFAULT_PLAN: PlanTier = "free";

export function canAccess(
  userPlan: PlanTier,
  requiredPlan: PlanTier
): boolean {
  return PLANS[userPlan].rank >= PLANS[requiredPlan].rank;
}

export function normalizePlan(plan?: string | null): PlanCode {
  if (!plan) return "free";
  if (plan in PLANS) return plan as PlanCode;
  return "free";
}
