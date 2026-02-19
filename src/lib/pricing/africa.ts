import type { Pricing } from "@/lib/pricing/loadPricing";

export const AFRICA_PRICING: Pricing = {
  currency: "USD",
  products: [
    { sku: "entry", price: 1.99, label: "Entry (Africa)" },
    { sku: "core", price: 4.99, label: "Core (Africa)" },
  ],
};
