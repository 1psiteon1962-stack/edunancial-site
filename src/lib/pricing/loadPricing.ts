export type PricingTier = {
  name: string;
  price: number;
  features: string[];
};

export type Pricing = {
  currency: string;
  tiers: PricingTier[];
};

export async function loadPricing(region: string): Promise<Pricing> {
  switch (region) {
    case "africa":
      return (await import("./africa")).AFRICA_PRICING;
    case "us":
    default:
      return (await import("./us")).US_PRICING;
  }
}
