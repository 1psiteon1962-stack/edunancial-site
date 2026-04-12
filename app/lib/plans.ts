export type PlanCode = "free" | "pro" | "enterprise";

export const plans: { code: PlanCode; name: string; price: number }[] = [
  { code: "free", name: "Starter", price: 0 },
  { code: "pro", name: "Pro", price: 29 },
  { code: "enterprise", name: "Enterprise", price: 99 }
];

/**
 * Ensures any incoming value resolves to a valid PlanCode
 */
export function normalizePlan(input: unknown): PlanCode {
  if (typeof input !== "string") return "free";

  const value = input.toLowerCase();

  if (value === "pro") return "pro";
  if (value === "enterprise") return "enterprise";

  return "free";
}
