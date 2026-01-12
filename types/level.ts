import type { PlanTier } from "./plan";

export type LevelCode = "L1" | "L2" | "L3" | "L4" | "L5";

export interface LevelSpec {
  code: LevelCode;
  title: string;
  tagline: string;
  recommendedPlan: PlanTier;
  outcomes: string[];
  modules: { title: string; bullets: string[] }[];
  nextPath: { label: string; href: string };
}
