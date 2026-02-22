export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
};

export async function loadPricing(): Promise<PricingPlan[]> {
  // For now this is static.
  // Later this can pull from database or CMS.

  return [
    {
      id: "starter",
      name: "Starter",
      price: 4.99,
      currency: "USD",
      description: "Entry-level access to Edunancial resources.",
      features: [
        "Access to core financial literacy content",
        "Basic downloadable resources",
        "Email updates"
      ]
    },
    {
      id: "pro",
      name: "Pro",
      price: 19.99,
      currency: "USD",
      description: "Advanced tools and expanded curriculum.",
      features: [
        "Everything in Starter",
        "Advanced investing modules",
        "KPI tracking tools",
        "Priority support"
      ]
    }
  ];
}
