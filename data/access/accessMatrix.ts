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
 * This file is the SINGLE source of truth for plans
 */
export const ACCESS_MATRIX = {
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
} as const;

/**
 * PlanCode is derived HERE and exported
 */
export type PlanCode = keyof typeof ACCESS_MATRIX;
