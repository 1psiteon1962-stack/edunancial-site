// types/plan.ts

export type Currency = "USD" | "EUR" | "GBP" | "DOP";

export type Plan = {
  code: string;
  name: string;
  price: number;
  currency: Currency;
  interval: "month" | "year";
  description: string;
  features: string[];
  stripePriceId?: string;
};

export const PLANS = {
  starter: {
    code: "starter",
    name: "Starter",
    price: 9.99,
    currency: "USD",
    interval: "month",
    description: "Access to basic financial education and tools",
    features: [
      "Core lessons",
      "Community access",
      "Basic calculators",
    ],
  },
  pro: {
    code: "pro",
    name: "Pro",
    price: 49.99,
    currency: "USD",
    interval: "month",
    description: "Advanced tools for serious builders",
    features: [
      "All Starter features",
      "Advanced analytics",
      "Premium courses",
      "Live support",
    ],
  },
  enterprise: {
    code: "enterprise",
    name: "Enterprise",
    price: 199.99,
    currency: "USD",
    interval: "month",
    description: "For firms, advisors, and investor groups",
    features: [
      "All Pro features",
      "Multi-user accounts",
      "Dedicated support",
      "Custom reporting",
    ],
  },
} as const;

export type PlanCode = keyof typeof PLANS;

export type PlanMap = Record<PlanCode, Plan>;
