// app/lib/plans.ts

export type PlanCode = "starter" | "growth" | "enterprise";

export function normalizePlan(plan: string): PlanCode {
  const p = plan.toLowerCase().trim();

  if (p === "starter" || p === "basic") return "starter";
  if (p === "growth" || p === "pro") return "growth";
  if (p === "enterprise") return "enterprise";

  return "starter";
}
