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
 * Matches ALL properties referenced by UI components.
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

  /**
   * AccessGate input.
   * When present, determines required subscription or feature flags.
   */
  requires?: RequiredPlan | RequiredPlan[];

  /** Default required plan if requires is not used */
  requiredPlan: RequiredPlan;
}

/**
 * Backward-compatibility alias for existing imports.
 */
export type LevelSpec = LevelDefinition;
