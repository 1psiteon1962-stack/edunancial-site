export type PlanCode = "free" | "starter" | "pro" | "elite";

export type Plan = {
  code: PlanCode;
  label: string;
  price: number;
  description: string;
  features: string[];
};

export const PLANS: Record<PlanCode, Plan> = {
  free: {
    code: "free",
    label: "Free",
    price: 0,
    description: "Informal founder, learning mode",
    features: ["Diagnosis tools", "Visibility framework", "Education access"],
  },
  starter: {
    code: "starter",
    label: "Starter",
    price: 29,
    description: "Formalizing founder",
    features: ["Business structure tools", "Credit readiness", "Basic legal templates"],
  },
  pro: {
    code: "pro",
    label: "Pro",
    price: 99,
    description: "Capital-ready business",
    features: ["Full compliance", "Investor readiness", "Contract systems"],
  },
  elite: {
    code: "elite",
    label: "Elite",
    price: 299,
    description: "Protected enterprise",
    features: ["Legal protection", "Funding access", "UDL integration"],
  },
};

export const PLAN_LABELS: Record<PlanCode, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  elite: "Elite",
};
