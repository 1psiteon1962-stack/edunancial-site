// types/plan.ts

/**
 * Central plan code type used across Edunancial.
 * This file exists because multiple parts of the app import:
 *
 *   import type { PlanCode } from "@/types/plan";
 *
 * Netlify builds will fail unless this module exists.
 */

export type PlanCode =
  | "free"
  | "starter"
  | "pro"
  | "builder"
  | "enterprise";
