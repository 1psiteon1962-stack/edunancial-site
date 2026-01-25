// src/types/plan.ts

export interface Plan {
  code: string;

  // REQUIRED: used in src/data/plans.ts
  name: string;

  description: string;
  priceMonthlyUsd: number;

  features: string[];
}
