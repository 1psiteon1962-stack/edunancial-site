// app/lib/plans.ts

// ✅ Single source of truth for every plan in the system
export type PlanCode =
  | "free"
  | "starter"
  | "growth"
  | "builder"
  | "pro"
  | "enterprise"
  | "elite";

// ✅ Normalize any incoming string into a valid PlanCode
export function normalizePlan(value: string): PlanCode {
  const v = value.trim().toLowerCase();

  switch (v) {
    case "free":
      return "free";

    case "starter":
      return "starter";

    case "growth":
      return "growth";

    case "builder":
      return "builder";

    case "pro":
      return "pro";

    case "enterprise":
      return "enterprise";

    case "elite":
      return "elite";

    default:
      // fallback safety
      return "free";
  }
}
