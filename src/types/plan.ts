// src/types/plan.ts

export type PlanCode =
  | "free"
  | "starter"
  | "builder"
  | "pro"
  | "enterprise";

export type Plan = {
  code: PlanCode;
  label: string;
  priceMonthlyUsd: number;
};

export const PLANS: Record<PlanCode, Plan> = {
  free: {
    code: "free",
    label: "Free",
    priceMonthlyUsd: 0,
  },
  starter: {
    code: "starter",
    label: "Starter",
    priceMonthlyUsd: 9,
  },
  builder: {
    code: "builder",
    label: "Builder",
    priceMonthly
