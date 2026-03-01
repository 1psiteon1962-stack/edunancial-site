import type { Pricing } from "./types";

export const ASIA_PRICING: Pricing = {
  currency: "USD",
  products: [
    {
      sku: "entry",
      price: 2.49,
      label: "Entry",
      description: "Foundational finance + discipline.",
      features: ["Core lessons", "Basic tools", "Email support"],
    },
    {
      sku: "core",
      price: 6.99,
      label: "Core",
      description: "Operations, KPIs, and consistency.",
      features: ["Everything in Entry", "KPI tracking", "Community access"],
    },
    {
      sku: "pro",
      price: 13.99,
      label: "Pro",
      description: "Scaling frameworks and advanced tools.",
      features: ["Everything in Core", "Advanced templates", "Priority support"],
    },
  ],
};
