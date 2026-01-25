// src/data/plans.ts

import { Plan } from "@/types/plans";

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
    description: "Starter access for new investors.",
    priceMonthlyUsd: 9,
    features: ["Starter tools", "Beginner lessons", "Email support"],
  },
];
