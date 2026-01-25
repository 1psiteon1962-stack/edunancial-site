export type PlanCode =
  | "free"
  | "starter"
  | "builder"
  | "pro"
  | "enterprise";

export const DEFAULT_PLAN_CODE: PlanCode = "starter";

export function normalizePlan(
  input?: string | null
): PlanCode {
  if (!input) return DEFAULT_PLAN_CODE;

  const code = input.toLowerCase().trim();

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
      return DEFAULT_PLAN_CODE;
  }
}
