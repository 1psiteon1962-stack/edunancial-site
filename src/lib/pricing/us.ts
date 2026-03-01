import type { Pricing } from "./types";

export const US_PRICING: Pricing = {
  currency: "USD",
  products: [
    {
      sku: "entry",
      price: 3.99,
      label: "Entry",
      description: "Get started with the essentials.",
      features: ["Core lessons", "Basic tools", "Email support"],
    },
    {
      sku: "core",
      price: 9.99,
      label: "Core",
      description: "Best for building consistent progress.",
      features: ["Everything in Entry", "KPI tracking", "Community access"],
    },
    {
      sku: "pro",
      price: 19.99,
      label: "Pro",
      description: "For serious builders and operators.",
      features: ["Everything in Core", "Advanced templates", "Priority support"],
    },
  ],
};
