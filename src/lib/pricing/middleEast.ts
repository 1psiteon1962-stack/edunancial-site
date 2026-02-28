import type { Pricing } from "@/lib/pricing/loadPricing";

export const MIDDLE_EAST_PRICING: Pricing = {
  currency: "USD",
  tiers: [
    {
      name: "Entry",
      price: 5.99,
      features: [
        "Core financial literacy modules",
        "Mobile-friendly access",
      ],
    },
    {
      name: "Core",
      price: 12.99,
      features: [
        "Full curriculum access",
        "Downloadable resources",
        "Priority support",
      ],
    },
  ],
};
