// data/access/accessMatrix.ts

export type AccessArea =
  | "LEVEL1"
  | "LEVEL2"
  | "LEVEL3"
  | "APPS"
  | "COURSES"
  | "TOOLS";

export const ACCESS_MATRIX = {
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
} satisfies Record<string, AccessArea[]>;

export type PlanCode = keyof typeof ACCESS_MATRIX;
