export type PricingRegion =
  | "us"
  | "latam"
  | "caribbean"
  | "africa"
  | "europe"
  | "asia";

export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
};

export async function loadPricing(
  region: PricingRegion = "us"
): Promise<PricingPlan[]> {
  const currencyByRegion: Record<PricingRegion, string> = {
    us: "USD",
    latam: "USD",
    caribbean: "USD",
    africa: "USD",
    europe: "EUR",
    asia: "USD",
  };

  return [
    {
      id: "basic",
      name: "Basic",
      price: 0,
      currency: currencyByRegion[region],
      features: ["Free access", "Basic tools"],
    },
    {
      id: "pro",
      name: "Pro",
      price: region === "africa" ? 5 : 29,
      currency: currencyByRegion[region],
      features: ["Advanced tools", "Priority support"],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: region === "africa" ? 25 : 99,
      currency: currencyByRegion[region],
      features: ["Full platform", "Dedicated support"],
    },
  ];
}
