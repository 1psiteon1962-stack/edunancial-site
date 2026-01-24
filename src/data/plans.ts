import type { Plan } from "@/types/plan";

export const PLANS: Plan[] = [
  {
    code: "free",
    name: "Free",
    description: "Basic access for public visitors.",
    priceMonthlyUsd: 0,
    features: ["Public pages", "Free previews"],
    active: true,
  },
  {
    code: "starter",
    name: "Starter",
    description: "Entry-level tools and curriculum access.",
    priceMonthlyUsd: 4.99,
    features: ["Starter tools", "Core curriculum access"],
    active: true,
  },
  {
    code: "growth",
    name: "Growth",
    description: "Expanded tools for serious learners.",
    priceMonthlyUsd: 9.99,
    features: ["Everything in Starter", "Growth-level KPI tools"],
    active: true,
  },
  {
    code: "pro",
    name: "Pro",
    description: "Professional-grade access and advanced content.",
    priceMonthlyUsd: 19.99,
    features: ["Everything in Growth", "Advanced systems + downloads"],
    active: true,
  },
  {
    code: "enterprise",
    name: "Enterprise",
    description: "Institutional access for organizations.",
    priceMonthlyUsd: 99.0,
    features: ["Custom onboarding", "Team access", "Enterprise support"],
    active: false,
  },
];
