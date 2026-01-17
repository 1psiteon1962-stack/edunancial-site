// types/level.ts

export type LevelCode = "L1" | "L2" | "L3" | "L4";

export type RequiredPlan =
  | "free"
  | "founder"
  | "pro"
  | "elite"
  | "enterprise";

/**
 * Canonical level definition used across pages and data.
 * This matches ALL properties currently referenced by UI pages.
 */
export interface LevelDefinition {
  /** Short code used for lookup (e.g. L1, L2) */
  code: LevelCode;

  /** Human-readable title */
  title: string;

  /** Short subtitle shown under the title */
  tagline?: string;

  /** Longer descriptive paragraph shown on level pages */
  description?: string;

  /** Minimum subscription plan required */
  requiredPlan: RequiredPlan;
}

/**
 * Backward-compatibility alias.
 * Existing data files still import LevelSpec.
 */
export type LevelSpec = LevelDefinition;
