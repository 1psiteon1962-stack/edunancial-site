/**
 * app/lib/plans.ts
 *
 * Single source of truth for all plan codes in the system.
 * Every page, AccessGate, login, signup, etc. must rely on this.
 */

export type PlanCode =
  | "free"
  | "starter"
  | "pro"
  | "growth"
  | "elite"
  | "enterprise";

/**
 * Normalize any incoming string into a valid PlanCode.
 * This guarantees TypeScript safety everywhere.
 */
export function normalizePlan(input: string): PlanCode {
  const value = input.trim().toLowerCase();

  if (value === "free") return "free";
  if (value === "starter") return "starter";
  if (value === "pro") return "pro";
  if (value === "growth") return "growth";
  if (value === "elite") return "elite";
  if (value === "enterprise") return "enterprise";

  // Default fallback
  return "free";
}
