// src/lib/pricing/caribbean.ts

import type { Pricing } from "./types";

export const CARIBBEAN_PRICING: Pricing = {
  currency: "USD",
  products: [
    {
      sku: "entry",
      price: 2.49,
      label: "Entry",
      description: "Foundation-level access for Caribbean entrepreneurs.",
      features: ["Core lessons", "Basic tools", "Email support"]
    },
    {
      sku: "core",
      price: 5.99,
      label: "Core",
      description: "Execution structure and KPI focus.",
      features: ["Everything in Entry", "KPI tracking", "Community access"]
    },
    {
      sku: "pro",
      price: 12.99,
      label: "Pro",
      description: "Advanced governance and scaling frameworks.",
      features: ["Everything in Core", "Advanced frameworks", "Priority support"]
    }
  ]
};
