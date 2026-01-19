/**
 * SINGLE SOURCE OF TRUTH FOR PLAN LOGIC
 * ------------------------------------
 * Do NOT create plural variants.
 * Do NOT duplicate this file.
 * Do NOT introduce uppercase literals elsewhere.
 */

export type PlanCode =
  | "free"
  | "starter"
  | "basic"
  | "pro"
  | "enterprise";

/**
 * Normalizes any incoming plan value
 * (DB, session, API, legacy strings).
 */
export function normalizePlan(
  plan: string | null | undefined
): PlanCode {
  switch ((plan ?? "").toLowerCase()) {
    case "starter":
      return "starter";
    case "basic":
      return "basic";
    case "pro":
      return "pro";
    case "enterprise":
      return "enterprise";
    case "free":
    default:
      return "free";
  }
}

/**
 * Optional shared list if needed elsewhere
 */
export const ALL_PLANS: readonly PlanCode[] = [
  "free",
  "starter",
  "basic",
  "pro",
  "enterprise",
];
