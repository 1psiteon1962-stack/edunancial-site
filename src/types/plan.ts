export type PlanCode = "free" | "starter" | "growth" | "pro" | "enterprise";

export interface Plan {
  code: PlanCode;

  // FIX: page.tsx expects p.name
  name: string;

  description: string;

  price?: string;
}
