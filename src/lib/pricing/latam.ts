import type { Pricing } from "@/lib/pricing/loadPricing";

export const LATAM_PRICING: Pricing = {
  currency: "USD",
  products: [
    { sku: "entry", price: 2.99, label: "Entry (LATAM)" },
    { sku: "core", price: 5.99, label: "Core (LATAM)" },
  ],
};
