import type { Pricing } from "@/lib/pricing/loadPricing";

export const EUROPE_PRICING: Pricing = {
  currency: "EUR",
  tiers: [
    {
      name: "Entry",
      price: 8.99,
      features: [
        "Core financial literacy modules",
        "Mobile-friendly access",
      ],
    },
    {
      name: "Core",
      price: 17.99,
      features: [
        "Full curriculum access",
        "Downloadable resources",
        "Priority email support",
      ],
    },
  ],
};
