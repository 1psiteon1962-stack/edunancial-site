export type PlanLevel = "free" | "level-1" | "level-2" | "level-3";

export type Plan = {
  id: PlanLevel;
  name: string;
  price: number;
  description: string;
};

export const PLANS: Record<PlanLevel, Plan> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    description: "Basic access to introductory content and public resources."
  },
  "level-1": {
    id: "level-1",
    name: "Level 1",
    price: 19,
    description: "Entry-level educational tools, beginner financial literacy content, and starter analytics."
  },
  "level-2": {
    id: "level-2",
    name: "Level 2",
    price: 49,
    description: "Expanded training modules, deeper KPI tracking, and intermediate entrepreneurial tools."
  },
  "level-3": {
    id: "level-3",
    name: "Level 3",
    price: 99,
    description: "Full platform access including advanced analytics, global expansion tools, and premium resources."
  }
};

export function getPlan(plan: PlanLevel): Plan {
  return PLANS[plan];
}
