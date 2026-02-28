import type { Pricing } from "@/lib/pricing/loadPricing";

export const AFRICA_PRICING: Pricing = {
  currency: "USD",
  tiers: [
    {
      name: "Entry",
      price: 1.99,
      features: [
        "Access to basic financial literacy modules",
        "Mobile-friendly access",
      ],
    },
    {
      name: "Core",
      price: 4.99,
      features: [
        "Full core curriculum",
        "Downloadable resources",
        "Priority email support",
      ],
    },
  ],
};
