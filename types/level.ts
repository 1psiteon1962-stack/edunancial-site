// types/level.ts

export type RequiredPlan = "free" | "starter" | "pro" | "enterprise";

export interface LevelDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  tagline?: string;
  outcomes?: string[];
  requires?: RequiredPlan | RequiredPlan[];
}
