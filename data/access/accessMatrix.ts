// data/access/accessMatrix.ts

export type AccessArea =
  | "LEVEL1"
  | "LEVEL2"
  | "LEVEL3"
  | "APPS"
  | "COURSES"
  | "TOOLS";

export type PlanCode =
  | "free"
  | "starter"
  | "pro"
  | "builder";

/**
 * EXPLICITLY widen arrays to AccessArea[]
 * Do NOT rely on inference or `satisfies`
 */
export const ACCESS_MATRIX: Record<PlanCode, AccessArea[]> = {
  free: ["LEVEL1"],

  starter: ["LEVEL1", "APPS"],

  pro: ["LEVEL1", "LEVEL2", "APPS", "COURSES"],

  builder: [
    "LEVEL1",
    "LEVEL2",
    "LEVEL3",
    "APPS",
    "COURSES",
    "TOOLS",
  ],
};
