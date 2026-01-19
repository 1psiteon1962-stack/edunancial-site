/**
 * Canonical plan codes.
 * ALL plan checks, access gates, and data MUST use these exact lowercase values.
 */

export type PlanCode =
  | "free"
  | "starter"
  | "basic"
  | "pro"
  | "enterprise";

/**
 * Optional helper if needed elsewhere later.
 */
export const ALL_PLANS: readonly PlanCode[] = [
  "free",
  "starter",
  "basic",
  "pro",
  "enterprise",
];
