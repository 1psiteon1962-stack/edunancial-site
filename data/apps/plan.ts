// data/apps/plan.ts

/**
 * PlanCode is the subscription tier type used by app definitions.
 * Keeping this file inside /data/apps removes all path ambiguity on Netlify.
 */

export type PlanCode =
  | "free"
  | "starter"
  | "pro"
  | "builder"
  | "enterprise";
