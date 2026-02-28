import type { Pricing } from "@/lib/pricing/loadPricing";

export const CARIBBEAN_PRICING: Pricing = {
  currency: "USD",
  tiers: [
    {
      name: "Entry",
      price: 3.99,
      features: [
        "Core financial literacy modules",
        "Mobile-friendly access",
      ],
    },
    {
      name: "Core",
      price: 7.99,
      features: [
        "Full curriculum access",
        "Downloadable resources",
        "Priority email support",
      ],
    },
  ],
};
