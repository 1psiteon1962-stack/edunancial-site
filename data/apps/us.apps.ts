// data/apps/us.apps.ts

import type { PlanCode } from "@/types/plan";

export interface AppDefinition {
  name: string;
  description: string;
  accessLevel: PlanCode;
  lastUpdated: string;
}

export const usApps: AppDefinition[] = [
  {
    name: "Capital Stack",
    description: "Deal modeling, funding structures, and investor analytics.",
    accessLevel: "starter",
    lastUpdated: "2026-01-01",
  },
];
