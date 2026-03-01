// src/lib/pricing/oceania.ts

import type { Pricing } from "./types";

export const OCEANIA_PRICING: Pricing = {
  currency: "AUD",
  products: [
    {
      sku: "entry",
      price: 4.49,
      label: "Entry",
      description: "Core access for founders in Australia and Oceania.",
      features: ["Core lessons", "Basic tools", "Email support"]
    },
    {
      sku: "core",
      price: 9.99,
      label: "Core",
      description: "Execution discipline and KPI alignment.",
      features: ["Everything in Entry", "KPI tracking", "Community access"]
    },
    {
      sku: "pro",
      price: 19.99,
      label: "Pro",
      description: "Advanced governance and scale architecture.",
      features: ["Everything in Core", "Advanced frameworks", "Priority support"]
    }
  ]
};
