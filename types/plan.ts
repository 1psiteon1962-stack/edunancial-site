export type PlanCode =
  | "free"
  | "starter"
  | "basic"
  | "pro"
  | "enterprise";

export function normalizePlan(
  plan: unknown
): PlanCode {
  if (
    plan === "free" ||
    plan === "starter" ||
    plan === "basic" ||
    plan === "pro" ||
    plan === "enterprise"
  ) {
    return plan;
  }

  return "free";
}
