// types/level.ts

/**
 * Canonical plan codes used across the platform.
 * Keep this STRING-BASED to avoid page-level breakage.
 */
export type RequiredPlan =
  | "free"
  | "starter"
  | "basic"
  | "pro"
  | "elite"
  | "enterprise";

/**
 * Level definition used by region pages.
 */
export interface LevelDefinition {
  id: string;
  code: string;
  title: string;
  description?: string;
  tagline?: string;
  requires?: RequiredPlan | RequiredPlan[];
}
