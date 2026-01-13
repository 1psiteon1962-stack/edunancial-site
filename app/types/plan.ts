export type Plan = {
  id: number;
  slug: string;
  name: string;
  price: number;
  accessLevel: number;
  description: string;
};

export const PLANS: Plan[] = [
  {
    id: 1,
    slug: "l1",
    name: "Level 1 – Survival Entrepreneur",
    price: 4.99,
    accessLevel: 1,
    description: "Understanding money, systems, and survival economics."
  },
  {
    id: 2,
    slug: "l2",
    name: "Level 2 – Operator",
    price: 9.99,
    accessLevel: 2,
    description: "Basic business operations, compliance, and structure."
  },
  {
    id: 3,
    slug: "l3",
    name: "Level 3 – Growth Builder",
    price: 29.99,
    accessLevel: 3,
    description: "Scaling teams, capital, and systems."
  },
  {
    id: 4,
    slug: "l4",
    name: "Level 4 – Enterprise",
    price: 99.99,
    accessLevel: 4,
    description: "Multi-entity structuring, tax engineering, asset control."
  },
  {
    id: 5,
    slug: "l5",
    name: "Level 5 – Capital Architect",
    price: 499.99,
    accessLevel: 5,
    description: "Private equity, global capital, institutional structures."
  }
];

export const PLAN_LABELS: Record<number, string> = {
  1: "Survival Entrepreneur",
  2: "Operator",
  3: "Growth Builder",
  4: "Enterprise",
  5: "Capital Architect"
};

export function getPlanById(id: number): Plan | undefined {
  return PLANS.find(p => p.id === id);
}

export function getPlanByLevel(level: number): Plan | undefined {
  return PLANS.find(p => p.accessLevel === level);
}
