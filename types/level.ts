// types/level.ts

export type LevelCode = "L1" | "L2" | "L3" | "L4";

export interface LevelDefinition {
  code: LevelCode;

  /** Human-readable title shown on pages */
  title: string;

  /** Optional short description shown under the title */
  tagline?: string;

  /** Minimum plan required to access this level */
  requiredPlan: "free" | "founder" | "pro" | "elite" | "enterprise";
}
