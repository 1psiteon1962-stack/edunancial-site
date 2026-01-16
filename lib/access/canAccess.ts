import type { PlanCode } from "@/types/plan";
import { hasAccess } from "@/types/plan";

export function canAccess(
  userPlan: PlanCode,
  required: PlanCode
): boolean {
  return hasAccess(userPlan, required);
}
