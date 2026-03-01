import type { Pricing } from "./types";

export const GLOBAL_PRICING: Pricing = {
  currency: "USD",
  products: [
    {
      sku: "entry",
      price: 3.99,
      label: "Entry",
      description: "Start with the essentials.",
      features: ["Core lessons", "Basic tools", "Email support"],
    },
    {
      sku: "core",
      price: 9.99,
      label: "Core",
      description: "Build with metrics and discipline.",
      features: ["Everything in Entry", "KPI tracking", "Community access"],
    },
    {
      sku: "pro",
      price: 19.99,
      label: "Pro",
      description: "Scale with advanced systems.",
      features: ["Everything in Core", "Advanced templates", "Priority support"],
    },
  ],
};
