export type BillingInterval = "month" | "year" | "one-time";

export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: BillingInterval;
  description: string;
  stripePriceId?: string;
  paypalPlanId?: string;
  squarePlanId?: string;
  features: string[];
  accessLevel: number;
}

export const PLANS: Plan[] = [
  {
    id: "us-level-1",
    name: "Level 1 – Survival Entrepreneur",
    price: 0,
    interval: "one-time",
    description: "Free onboarding and survival-level founder tools.",
    features: [
      "Founder readiness baseline",
      "EduMath core",
      "US regulatory primer",
      "Cybersecurity fundamentals",
      "IP basics"
    ],
    accessLevel: 1
  },
  {
    id: "us-level-2",
    name: "Level 2 – Stable Operator",
    price: 49,
    interval: "month",
    description: "Operator-level financial and legal systems.",
    features: [
      "Entity structuring",
      "Bookkeeping systems",
      "Payment processing",
      "Tax compliance",
      "Security stack"
    ],
    accessLevel: 2
  },
  {
    id: "us-level-3",
    name: "Level 3 – Growth Builder",
    price: 149,
    interval: "month",
    description: "Scaling, hiring, capital readiness.",
    features: [
      "Sales systems",
      "Hiring frameworks",
      "KPI dashboards",
      "Banking & credit",
      "Fundraising readiness"
    ],
    accessLevel: 3
  },
  {
    id: "us-level-4",
    name: "Level 4 – Scalable Enterprise",
    price: 499,
    interval: "month",
    description: "Institutional-grade operations.",
    features: [
      "Governance",
      "Audit readiness",
      "Investor reporting",
      "Cross-border structuring",
      "Risk management"
    ],
    accessLevel: 4
  },
  {
    id: "us-level-5",
    name: "Level 5 – Capital Architect",
    price: 2500,
    interval: "month",
    description: "Capital deployment and global expansion.",
    features: [
      "PE structures",
      "Fund formation",
      "Global routing",
      "Deal flow",
      "Strategic acquisitions"
    ],
    accessLevel: 5
  }
];

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find(p => p.id === id);
}
