import { DEFAULT_PLAN, isPlanCode, type PlanCode } from "@/types/plan";

export function normalizePlan(value: unknown): PlanCode {
  if (isPlanCode(value)) return value;

  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (isPlanCode(v)) return v;
  }

  return DEFAULT_PLAN;
}

export const normalizePlanCode = normalizePlan;
