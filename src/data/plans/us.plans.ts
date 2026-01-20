// src/data/plans/us.plans.ts

export type PlanTier = "free" | "starter" | "pro" | "elite";

export type PlanDefinition = {
  code: string;        // unique id used in URLs / logic
  name: string;        // display name
  tier: PlanTier;      // access tier
  priceMonthlyUsd: number;
  description: string;
  features: string[];
  ctaLabel: string;
};

export const US_PLANS: PlanDefinition[] = [
  {
    code: "free",
    name: "Free",
    tier: "free",
    priceMonthlyUsd: 0,
    description: "Start here. Basic access to core educational content.",
    features: [
      "Intro resources",
      "Basic tools preview",
      "Community updates",
    ],
    ctaLabel: "Start Free",
  },
  {
    code: "starter",
    name: "Starter",
    tier: "starter",
    priceMonthlyUsd: 4.99,
    description: "For beginners building consistency and basic systems.",
    features: [
      "All Free content",
      "Starter worksheets",
      "Beginner tools access",
      "Email updates",
    ],
    ctaLabel: "Choose Starter",
  },
  {
    code: "pro",
    name: "Pro",
    tier: "pro",
    priceMonthlyUsd: 9.99,
    description: "For serious builders—more tools, structure, and guidance.",
    features: [
      "All Starter content",
      "Pro tools access",
      "Templates & calculators",
      "Priority updates",
    ],
    ctaLabel: "Choose Pro",
  },
  {
    code: "elite",
    name: "Elite",
    tier: "elite",
    priceMonthlyUsd: 19.99,
    description: "Executive-style access and advanced resources.",
    features: [
      "All Pro content",
      "Elite tools access",
      "Advanced planning resources",
      "VIP updates",
    ],
    ctaLabel: "Choose Elite",
  },
];
