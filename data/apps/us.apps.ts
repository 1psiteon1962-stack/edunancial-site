import type { PlanCode } from "@/types/plan";

export type AppCard = {
  name: string;
  description: string;
  accessLevel: PlanCode;
  lastUpdated: string;
};

export const US_APPS: AppCard[] = [
  {
    name: "Capital Stack",
    description: "Deal modeling, funding structures, and investor analytics.",
    accessLevel: "starter",
    lastUpdated: "2026-01-01",
  },
];
