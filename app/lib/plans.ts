export type PlanCode =
  | "free"
  | "starter"
  | "pro"
  | "elite"
  | "enterprise";

export const plans: { code: PlanCode; name: string; price: number }[] = [
  { code: "free", name: "Free", price: 0 },
  { code: "starter", name: "Starter", price: 9 },
  { code: "pro", name: "Pro", price: 29 },
  { code: "elite", name: "Elite", price: 59 },
  { code: "enterprise", name: "Enterprise", price: 99 }
];

export function normalizePlan(input: unknown): PlanCode {
  if (typeof input !== "string") return "free";

  const value = input.toLowerCase();

  if (value === "starter") return "starter";
  if (value === "pro") return "pro";
  if (value === "elite") return "elite";
  if (value === "enterprise") return "enterprise";

  return "free";
}
