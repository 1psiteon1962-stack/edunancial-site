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

  /** Optional annual price in USD (if you offer yearly billing) */
  priceYearlyUsd?: number;

  /** Feature bullets shown on the Plans page */
  features: string[];

  /** Whether this plan is currently purchasable */
  active?: boolean;
}
