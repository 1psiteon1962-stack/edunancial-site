export interface Plan {
  code: string;

  // FIX: plans.ts includes "name", so the type must allow it
  name: string;

  description: string;
  priceMonthlyUsd: number;
  features: string[];

  // add any other existing fields below if you already had them
}
