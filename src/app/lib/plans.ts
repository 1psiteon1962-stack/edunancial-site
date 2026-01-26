// src/app/lib/plans.ts

import type { PlanCode } from "@/types/plan";

export function normalizePlan(
  plan: string | null | undefined
): PlanCode {
  if (!plan) return "free";

  const p = plan.toLowerCase().trim();

  if (p === "starter") return "starter";
  if (p === "builder") return "builder";
  if (p === "pro") return "pro";
  if (p === "enterprise") return "enterprise";

  return "free";
}
