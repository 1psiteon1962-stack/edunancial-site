// lib/access/canAccess.ts

import type { PlanCode } from "../types/plan";

/**
 * Returns true if a user on the given plan can access
 * a feature requiring the minimum plan.
 */
export function canAccess(plan: PlanCode, required: PlanCode): boolean {
  const order: PlanCode[] = [
    "free",
    "starter",
    "pro",
    "builder",
    "enterprise",
  ];

  return order.indexOf(plan) >= order.indexOf(required);
}
