// data/access/accessMatrix.ts

import { PlanCode } from "@/data/plans/us.plans";

/**
 * Areas / features that can be gated by plan
 */
export type AccessArea =
  | "LEVEL1"
  | "LEVEL2"
  | "LEVEL3"
  | "APPS"
  | "COURSES"
  | "TOOLS";

/**
 * Centralized access control matrix.
 * Keys MUST match PlanCode exactly.
 */
export const ACCESS_MATRIX: Record<PlanCode, AccessArea[]> = {
  free: ["LEVEL1"],

  starter: [
    "LEVEL1",
    "APPS",
  ],

  pro: [
    "LEVEL1",
    "LEVEL2",
    "APPS",
    "COURSES",
  ],

  builder: [
    "LEVEL1",
    "LEVEL2",
    "LEVEL3",
    "APPS",
    "COURSES",
    "TOOLS",
  ],
};
