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
    case "asia":
      return (await import("./asia")).ASIA_PRICING;
    case "latam":
      return (await import("./latam")).LATAM_PRICING;
    case "europe":
      return (await import("./europe")).EUROPE_PRICING;
    case "middleeast":
      return (await import("./middleEast")).MIDDLE_EAST_PRICING;
    case "caribbean":
      return (await import("./caribbean")).CARIBBEAN_PRICING;
    case "oceania":
      return (await import("./oceania")).OCEANIA_PRICING;
    case "us":
    default:
      return (await import("./us")).US_PRICING;
  }
}
