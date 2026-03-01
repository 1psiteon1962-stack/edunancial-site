// src/lib/pricing/europe.ts

import type { Pricing } from "./types";

export const EUROPE_PRICING: Pricing = {
  currency: "EUR",
  products: [
    {
      sku: "entry",
      price: 3.49,
      label: "Entry",
      description: "Core access for EU-based founders.",
      features: ["Core lessons", "Basic tools", "Email support"]
    },
    {
      sku: "core",
      price: 7.99,
      label: "Core",
      description: "Operational structure and KPI discipline.",
      features: ["Everything in Entry", "KPI tracking", "Community access"]
    },
    {
      sku: "pro",
      price: 14.99,
      label: "Pro",
      description: "Advanced governance and scaling frameworks.",
      features: ["Everything in Core", "Advanced frameworks", "Priority support"]
    }
  ]
};
