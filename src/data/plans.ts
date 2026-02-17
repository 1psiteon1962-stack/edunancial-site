// src/data/plans.ts

import type { Plan } from "../types/plans";

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Access to core educational content",
    price: 0,
    features: [
      "Core articles",
      "Basic tools",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Advanced tools and insights",
    price: 29,
    features: [
      "Everything in Starter",
      "Advanced calculators",
      "Priority updates",
    ],
  },
  {
    id: "builder",
    name: "Builder",
    description: "Full platform access",
    price: 99,
    features: [
      "Everything in Pro",
      "Custom builds",
      "Early access features",
    ],
  },
];
