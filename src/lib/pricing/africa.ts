import type { Pricing } from "./types";

export const AFRICA_PRICING: Pricing = {
  currency: "USD",
  products: [
    {
      sku: "entry",
      price: 1.99,
      label: "Entry",
      description: "Foundations for consistent progress.",
      features: ["Core lessons", "Basic tools", "Email support"],
    },
    {
      sku: "core",
      price: 4.99,
      label: "Core",
      description: "Structure + metrics for growth.",
      features: ["Everything in Entry", "KPI tracking", "Community access"],
    },
    {
      sku: "pro",
      price: 8.99,
      label: "Pro",
      description: "Operator-grade tools for scaling.",
      features: ["Everything in Core", "Advanced templates", "Priority support"],
    },
  ],
};
