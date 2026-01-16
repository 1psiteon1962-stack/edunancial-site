// lib/access/canAccess.ts

import type { PlanCode } from "@/types/plan";
import { hasAccess } from "@/types/plan";

/**
 * Thin wrapper used everywhere else.
 * Do NOT duplicate logic.
 */
export function canAccess(
  userPlan: PlanCode,
  requiredPlan: PlanCode
): boolean {
  return hasAccess(userPlan, requiredPlan);
}
