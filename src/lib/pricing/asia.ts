import type { Pricing } from "@/lib/pricing/loadPricing";

export const ASIA_PRICING: Pricing = {
  currency: "USD",
  products: [
    { sku: "entry", price: 2.49, label: "Entry (Asia)" },
    { sku: "core", price: 6.99, label: "Core (Asia)" },
  ],
};
