import { DEFAULT_PLAN, hasAccess, isPlanCode, PLANS } from "@/types/plan";
import type { PlanCode } from "@/types/plan";

export { DEFAULT_PLAN, hasAccess, isPlanCode };

export function normalizePlan(value?: string | null): PlanCode {
  if (!value) return DEFAULT_PLAN;
  if (isPlanCode(value)) return value;
  return DEFAULT_PLAN;
}

export function getPlanLabel(plan: PlanCode): string {
  return PLANS[plan].label;
}
