import { getSiteRegion, type SiteRegion } from "@/lib/regionRuntime";

export type Pricing = {
  currency: string;
  products: Array<{
    sku: string;
    price: number;
    label: string;
  }>;
};

const DEFAULT_US_PRICING: Pricing = {
  currency: "USD",
  products: [
    { sku: "entry", price: 4.99, label: "Entry" },
    { sku: "core", price: 9.99, label: "Core" },
  ],
};

async function importPricing(region: SiteRegion): Promise<Pricing | null> {
  try {
    switch (region) {
      case "latam":
        return (await import("@/lib/pricing/latam")).LATAM_PRICING;
      case "africa":
        return (await import("@/lib/pricing/africa")).AFRICA_PRICING;
      case "asia":
        return (await import("@/lib/pricing/asia")).ASIA_PRICING;
      case "mena":
        return (await import("@/lib/pricing/mena")).MENA_PRICING;
      case "eu":
        return (await import("@/lib/pricing/eu")).EU_PRICING;
      case "global":
        return (await import("@/lib/pricing/global")).GLOBAL_PRICING;
      case "us":
      default:
        return DEFAULT_US_PRICING;
    }
  } catch {
    // ✅ never crash, just return null
    return null;
  }
}

export async function loadPricing(): Promise<Pricing> {
  const region = getSiteRegion();

  // ✅ mirror failure never kills runtime
  const regionPricing = await importPricing(region);
  if (regionPricing) return regionPricing;

  // ✅ fallback to US pricing if anything goes wrong
  return DEFAULT_US_PRICING;
}
