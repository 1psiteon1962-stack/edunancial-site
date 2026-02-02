// types/plan.ts

/**
 * PlanCode is used across Edunancial to identify subscription tiers.
 * Netlify builds require this module to exist because it is imported as:
 *
 *   import type { PlanCode } from "@/types/plan";
 */

export type PlanCode =
  | "free"
  | "starter"
  | "pro"
  | "builder"
  | "enterprise";
