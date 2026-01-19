// lib/access/canAccess.ts

import type { PlanCode } from "@/types/plan";

export function canAccess(
  userPlan: PlanCode,
  allowed: readonly PlanCode[]
): boolean {
  return allowed.includes(userPlan);
}
