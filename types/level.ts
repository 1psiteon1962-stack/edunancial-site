import type { PlanCode } from "./plan";

export type LevelCode = "L1" | "L2" | "L3" | "L4";

export type LevelDefinition = {
  level: LevelCode;
  requiredPlan: PlanCode;
};

/**
 * Backward-compatible alias used by data files
 */
export type LevelSpec = LevelDefinition;
