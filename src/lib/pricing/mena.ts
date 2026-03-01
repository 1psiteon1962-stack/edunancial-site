import type { Pricing } from "./types";

export const MENA_PRICING: Pricing = {
  currency: "USD",
  products: [
    {
      sku: "entry",
      price: 2.49,
      label: "Entry",
      description: "Strong foundations and discipline.",
      features: ["Core lessons", "Basic tools", "Email support"],
    },
    {
      sku: "core",
      price: 6.49,
      label: "Core",
      description: "Business structure + performance metrics.",
      features: ["Everything in Entry", "KPI tracking", "Community access"],
    },
    {
      sku: "pro",
      price: 12.49,
      label: "Pro",
      description: "Scaling systems and advanced templates.",
      features: ["Everything in Core", "Advanced templates", "Priority support"],
    },
  ],
};
