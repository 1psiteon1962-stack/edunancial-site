// src/data/plans.ts

import type { Plan } from "@/types/plan";

export const PLANS: Plan[] = [
  {
    code: "free",
    name: "Free",
    description: "Basic public access.",
    priceMonthlyUsd: 0,
    features: ["Browse free content", "View public curriculum"],
  },
  {
    code: "starter",
    name: "Starter",
    description: "Entry-level entrepreneur tools.",
    priceMonthlyUsd: 9,
    features: ["Starter apps", "Level 1 access", "Basic KPI tools"],
  },
  {
    code: "growth",
    name: "Growth",
    description: "Serious builder tier.",
    priceMonthlyUsd: 29,
    features: ["Level 2–3 access", "Growth playbooks", "Expanded KPI tracking"],
  },
  {
    code: "pro",
    name: "Pro",
    description: "Full professional access.",
    priceMonthlyUsd: 79,
    features: ["All levels unlocked", "Premium tools", "Investor systems"],
  },
  {
    code: "enterprise",
    name: "Enterprise",
    description: "Organizations and institutions.",
    priceMonthlyUsd: 199,
    features: ["Custom onboarding", "Dedicated support", "Enterprise analytics"],
  },
];
