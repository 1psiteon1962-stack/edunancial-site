// types/level.ts

export type RequiredPlan =
  | "free"
  | "starter"
  | "pro"
  | "enterprise";

/**
 * Canonical level definition used across all regions and pages
 */
export interface LevelDefinition {
  code: string;
  title: string;

  tagline?: string;
  description?: string;

  /**
   * Which plan(s) are required to access this level
   * - undefined or "free" = public
   */
  requires?: RequiredPlan | RequiredPlan[];

  /**
   * Optional learning or business outcomes
   */
  outcomes?: string[];
}
