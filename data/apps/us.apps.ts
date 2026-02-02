// data/apps/us.apps.ts

import type { PlanCode } from "./plan";

export interface AppDefinition {
  name: string;
  description: string;
  href: string;
  plan: PlanCode;
}

export const usApps: AppDefinition[] = [
  {
    name: "Starter Access",
    description: "Basic access to Edunancial educational tools.",
    href: "/apps/starter",
    plan: "starter",
  },
  {
    name: "Pro Access",
    description: "Full access to premium financial education resources.",
    href: "/apps/pro",
    plan: "pro",
  },
  {
    name: "Builder Access",
    description: "Advanced business-building systems and governance tools.",
    href: "/apps/builder",
    plan: "builder",
  },
  {
    name: "Enterprise Access",
    description: "Institutional-grade access and scaling resources.",
    href: "/apps/enterprise",
    plan: "enterprise",
  },
];
