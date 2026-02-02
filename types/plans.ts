// types/plan.ts

/**
 * PlanCode is the central subscription tier type.
 * Netlify/Linux builds require this exact file/path to exist.
 */

export type PlanCode =
  | "free"
  | "starter"
  | "pro"
  | "builder"
  | "enterprise";
