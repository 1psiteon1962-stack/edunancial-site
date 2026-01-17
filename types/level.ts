// types/level.ts

import type { RequiredPlan } from "@/components/AccessGate";

export interface LevelDefinition {
  code: string;

  title: string;

  tagline?: string;

  description?: string;

  outcomes?: string[];

  requires?: RequiredPlan | RequiredPlan[];
}
