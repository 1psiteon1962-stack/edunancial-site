export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
};

export async function loadPricing(): Promise<PricingPlan[]> {
  // Temporary fallback data so build succeeds
  return [
    {
      id: "basic",
      name: "Basic",
      price: 0,
      currency: "USD",
      features: ["Free access", "Basic tools"],
    },
    {
      id: "pro",
      name: "Pro",
      price: 29,
      currency: "USD",
      features: ["Advanced tools", "Priority support"],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 99,
      currency: "USD",
      features: ["Full platform", "Dedicated support"],
    },
  ];
}
