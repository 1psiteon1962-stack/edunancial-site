// src/data/plans.ts

import type { PricingPlan } from "@/types/plans";

export const PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    features: ["Access to core content"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    features: ["Everything in Starter", "Advanced tools"],
  },
  {
    id: "builder",
    name: "Builder",
    price: 99,
    features: ["Everything in Pro", "Custom builds"],
  },
];
