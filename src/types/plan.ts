// src/types/plan.ts

export type PlanCode =
  | "free"
  | "starter"
  | "growth"
  | "pro"
  | "enterprise";

export interface Plan {
  code: PlanCode;

  name: string;
  description: string;

  /** Monthly subscription price in USD */
  priceMonthlyUsd: number;

  /** Optional annual price */
  priceYearlyUsd?: number;

  /** Feature bullets */
  features: string[];

  /** Whether purchasable */
  active?: boolean;
}
