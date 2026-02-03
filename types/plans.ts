// types/plan.ts

/**
 * Global PlanCode type.
 * Required because multiple modules import:
 *
 *   import type { PlanCode } from "@/types/plan";
 *
 * This file MUST exist at /types/plan.ts (all lowercase).
 */

export type PlanCode =
  | "free"
  | "starter"
  | "pro"
  | "builder"
  | "enterprise";
