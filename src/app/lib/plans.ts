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
    name: "Individual Membership",
    price: 24.99,
  },
  premium: {
    name: "Approved Organization Membership",
    price: 14.99,
  },
  enterprise: {
    name: "100+ Member Organization Rate",
    price: 9.99,
  },
  beta: {
    name: "Beta Tester",
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
