import { PlanCode } from "../plans/us.plans";

export type AccessArea =
  | "LEVEL1"
  | "LEVEL2"
  | "LEVEL3"
  | "LEVEL4"
  | "LEVEL5"
  | "APPS"
  | "METRICS"
  | "CAPITAL";

export const ACCESS_MATRIX: Record<PlanCode, AccessArea[]> = {
  FREE: ["LEVEL1"],
  L1: ["LEVEL1", "APPS"],
  L2: ["LEVEL1", "LEVEL2", "APPS"],
  L3: ["LEVEL1", "LEVEL2", "LEVEL3", "APPS", "METRICS"],
  L4: ["LEVEL1", "LEVEL2", "LEVEL3", "LEVEL4", "APPS", "METRICS"],
  L5: ["LEVEL1", "LEVEL2", "LEVEL3", "LEVEL4", "LEVEL5", "APPS", "METRICS", "CAPITAL"]
};
