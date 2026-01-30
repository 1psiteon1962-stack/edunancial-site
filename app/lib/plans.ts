// app/lib/plans.ts

export type PlanCode =
  | "free"
  | "starter"
  | "growth"
  | "builder"
  | "pro"
  | "enterprise";

export function normalizePlan(input: string): PlanCode {
  const cleaned = input.trim().toLowerCase();

  if (
    cleaned === "free" ||
    cleaned === "starter" ||
    cleaned === "growth" ||
    cleaned === "builder" ||
    cleaned === "pro" ||
    cleaned === "enterprise"
  ) {
    return cleaned as PlanCode;
  }

  return "free";
}
