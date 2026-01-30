// app/lib/plans.ts
// Single source of truth for plan codes + normalization

export type PlanCode =
  | "free"
  | "starter"
  | "growth"
  | "builder"
  | "pro"
  | "enterprise"
  | "elite";

/**
 * Normalize any incoming string into a valid PlanCode.
 * Unknown values always fall back to "free".
 */
export function normalizePlan(input: string): PlanCode {
  const cleaned = input.trim().toLowerCase();

  switch (cleaned) {
    case "free":
    case "starter":
    case "growth":
    case "builder":
    case "pro":
    case "enterprise":
    case "elite":
      return cleaned as PlanCode;

    default:
      return "free";
  }
}

/**
 * Simple helper: compare plans by rank.
 * Higher index = higher access.
 */
const PLAN_ORDER: PlanCode[] = [
  "free",
  "starter",
  "growth",
  "builder",
  "pro",
  "enterprise",
  "elite",
];

export function hasPlanAccess(
  userPlan: string | null | undefined,
  requiredPlan: PlanCode
): boolean {
  const normalizedUser = userPlan ? normalizePlan(userPlan) : "free";

  return (
    PLAN_ORDER.indexOf(normalizedUser) >= PLAN_ORDER.indexOf(requiredPlan)
  );
}
