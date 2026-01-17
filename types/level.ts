// types/level.ts

export type LevelCode = "L1" | "L2" | "L3" | "L4";

export type RequiredPlan =
  | "free"
  | "founder"
  | "pro"
  | "elite"
  | "enterprise";

/**
 * Canonical level definition used across pages and data
 */
export interface LevelDefinition {
  code: LevelCode;

  /** Human-readable title shown on pages */
  title: string;

  /** Optional short description shown under the title */
  tagline?: string;

  /** Minimum plan required to access this level */
  requiredPlan: RequiredPlan;
}

/**
 * Backward-compatibility alias.
 * Some data files still import `LevelSpec`.
 * This keeps them working without touching the data layer.
 */
export type LevelSpec = LevelDefinition;
