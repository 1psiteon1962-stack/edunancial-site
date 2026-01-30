/**
 * types/plans.ts
 *
 * Canonical plan type definition for the entire site.
 * All components must import PlanCode ONLY from here.
 */

export type PlanCode =
  | "free"
  | "starter"
  | "pro"
  | "growth"
  | "elite"
  | "enterprise";
