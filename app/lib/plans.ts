/**
 * app/lib/plans.ts
 *
 * Plan normalization utilities.
 */

import type { PlanCode } from "@/types/plans";

export function normalizePlan(input: string): PlanCode {
  const value = input.trim().toLowerCase();

  if (value === "free") return "free";
  if (value === "starter") return "starter";
  if (value === "pro") return "pro";
  if (value === "growth") return "growth";
  if (value === "elite") return "elite";
  if (value === "enterprise") return "enterprise";

  return "free";
}
