import type { PlanCode } from "./plan";

export type LevelCode = "L1" | "L2" | "L3" | "L4";

export type LevelDefinition = {
  /**
   * Public identifier used by pages (lvl.code)
   */
  code: LevelCode;

  /**
   * Internal level identifier (kept for compatibility)
   */
  level: LevelCode;

  /**
   * Minimum plan required
   */
  requiredPlan: PlanCode;
};

/**
 * Backward-compatible alias used by data files
 */
export type LevelSpec = LevelDefinition;
