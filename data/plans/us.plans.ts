export type PlanCode = "FREE" | "L1" | "L2" | "L3" | "L4" | "L5";

export interface Plan {
  code: PlanCode;
  name: string;
  price: number; // USD per month
  description: string;
  features: string[];
}

export const US_PLANS: Plan[] = [
  {
    code: "FREE",
    name: "Explorer",
    price: 0,
    description: "Access to public tools and limited Level 1 content",
    features: ["Public articles", "Free tools", "Email signup"]
  },
  {
    code: "L1",
    name: "Starter",
    price: 4.99,
    description: "From zero to structured thinking",
    features: ["Level 1 curriculum", "Basic tools", "Founder onboarding"]
  },
  {
    code: "L2",
    name: "Builder",
    price: 9.99,
    description: "From side-hustle to business",
    features: ["Level 2 curriculum", "Business planning tools", "Market models"]
  },
  {
    code: "L3",
    name: "Operator",
    price: 29,
    description: "From business to scalable system",
    features: ["Level 3 curriculum", "KPI dashboards", "Legal + tax training"]
  },
  {
    code: "L4",
    name: "Founder",
    price: 99,
    description: "From company to investable asset",
    features: ["Level 4 curriculum", "Capital readiness", "Investor materials"]
  },
  {
    code: "L5",
    name: "Capital Architect",
    price: 0,
    description: "Invite-only global capital tier",
    features: ["Direct capital network", "Deal flow", "Private ventures"]
  }
];
