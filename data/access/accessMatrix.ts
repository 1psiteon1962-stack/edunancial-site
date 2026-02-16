// data/access/accessMatrix.ts

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
 * Centralized access control matrix
 * Typed explicitly to prevent literal over-narrowing
 */
export const ACCESS_MATRIX: Record<string, AccessArea[]> = {
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

/**
 * Canonical plan code type
 */
export type PlanCode = keyof typeof ACCESS_MATRIX;
