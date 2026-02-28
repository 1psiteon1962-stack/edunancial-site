import type { Pricing } from "@/lib/pricing/loadPricing";

export const LATAM_PRICING: Pricing = {
  currency: "USD",
  tiers: [
    {
      name: "Entry",
      price: 2.99,
      features: [
        "Access to basic financial literacy modules",
        "Mobile-friendly access",
      ],
    },
    {
      name: "Core",
      price: 5.99,
      features: [
        "Full core curriculum",
        "Downloadable resources",
        "Priority email support",
      ],
    },
  ],
};
