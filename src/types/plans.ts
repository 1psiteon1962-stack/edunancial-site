// src/types/plans.ts

export type Plan = {
  code: string;

  // REQUIRED because src/data/plans.ts uses "name"
  name: string;

  description: string;
  priceMonthlyUsd: number;

  features: string[];
};
