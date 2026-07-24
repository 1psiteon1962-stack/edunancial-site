export type PlanCode =
  | "basic"
  | "premium"
  | "enterprise"
  | "beta";

export const plans: Record<
  PlanCode,
  {
    name: string;
    price: number;
  }
> = {
  basic: {
    name: "Basic Membership",
    price: 49.99,
  },
  premium: {
    name: "Pro Membership",
    price: 69.99,
  },
  enterprise: {
    name: "Gold Membership",
    price: 99.99,
  },
  beta: {
    name: "Test Drive",
    price: 0,
  },
};

export function normalizePlan(input?: string | null): PlanCode {
  const value = (input || "basic").toLowerCase().trim();

  switch (value) {
    case "premium":
      return "premium";
    case "enterprise":
      return "enterprise";
    case "beta":
      return "beta";
    case "basic":
    default:
      return "basic";
  }
}
