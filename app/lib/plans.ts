export type PlanCode =
  | "free"
  | "starter"
  | "builder"
  | "pro"
  | "enterprise";

/**
 * Normalize any incoming plan string into a valid PlanCode.
 * FIX: Accepts string | null | undefined so TypeScript builds pass.
 */
export function normalizePlan(
  plan: string | null | undefined
): PlanCode {
  if (!plan) return "free";

  const code = plan.toLowerCase().trim();

  switch (code) {
    case "free":
      return "free";
    case "starter":
      return "starter";
    case "builder":
      return "builder";
    case "pro":
      return "pro";
    case "enterprise":
      return "enterprise";
    default:
      return "free";
  }
}
