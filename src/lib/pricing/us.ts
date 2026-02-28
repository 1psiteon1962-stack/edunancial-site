import type { Pricing } from "@/lib/pricing/loadPricing";

export const US_PRICING: Pricing = {
  currency: "USD",
  tiers: [
    {
      name: "Starter",
      price: 9.99,
      features: [
        "Full core curriculum",
        "Downloadable worksheets",
        "Email support",
      ],
    },
    {
      name: "Pro",
      price: 19.99,
      features: [
        "All Starter features",
        "Advanced investing modules",
        "Priority support",
      ],
    },
  ],
};
