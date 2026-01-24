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

  // REQUIRED FIX:
  priceMonthlyUsd: number;

  features: string[];
}
