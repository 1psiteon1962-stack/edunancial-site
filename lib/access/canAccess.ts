import type { PlanCode } from "@/types/plan";

export function canAccess(
  plan: PlanCode,
  allowed: readonly PlanCode[]
): boolean {
  return allowed.includes(plan);
}
