export type PlanCode =
  | "free"
  | "starter"
  | "founder"
  | "builder"
  | "pro"
  | "elite";

export interface Plan {
  code: PlanCode;
  name: string;
  label: string;
  description: string;
  price?: number;
}
