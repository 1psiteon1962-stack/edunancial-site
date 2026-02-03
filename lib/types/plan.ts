// lib/types/plan.ts

/**
 * PlanCode is the subscription tier identifier.
 * Stored inside /lib/types so imports are always stable.
 */

export type PlanCode =
  | "free"
  | "starter"
  | "pro"
  | "builder"
  | "enterprise";
