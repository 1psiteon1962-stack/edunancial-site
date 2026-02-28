import type { Pricing } from "@/lib/pricing/loadPricing";

export const OCEANIA_PRICING: Pricing = {
  currency: "AUD",
  tiers: [
    {
      name: "Entry",
      price: 7.99,
      features: [
        "Core financial literacy modules",
        "Mobile-friendly access",
      ],
    },
    {
      name: "Core",
      price: 14.99,
      features: [
        "Full curriculum access",
        "Downloadable resources",
        "Priority support",
      ],
    },
  ],
};
