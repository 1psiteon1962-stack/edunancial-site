// types/level.ts

/**
 * Canonical subscription plans
 */
export type RequiredPlan =
  | "free"
  | "starter"
  | "basic"
  | "pro"
  | "elite"
  | "enterprise";

/**
 * SINGLE source of truth for level data
 */
export interface LevelDefinition {
  id: string;
  code: string;
  title: string;
  description?: string;
  tagline?: string;
  requires?: RequiredPlan | RequiredPlan[];
}
