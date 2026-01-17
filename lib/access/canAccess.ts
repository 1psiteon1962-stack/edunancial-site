// lib/access/canAccess.ts

import type { PlanCode } from "@/types/plan";
import { hasAccess, normalizePlan } from "@/types/plan";

/**
 * Central access check used by AccessGate.
 * Accepts unknown-ish inputs safely and always returns boolean.
 */
export function canAccess(plan: PlanCode | unknown, required: PlanCode): boolean {
  const userPlan: PlanCode =
    typeof plan === "string" ? normalizePlan(plan) : "free";

  return hasAccess(userPlan, required);
}
