// lib/access.ts

import { PlanCode, PLAN_RANK } from "./plans";

export function canAccess(
  userPlan: PlanCode,
  requiredPlan: PlanCode
): boolean {
  return PLAN_RANK[userPlan] >= PLAN_RANK[requiredPlan];
}
