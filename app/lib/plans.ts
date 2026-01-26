// app/lib/plans.ts

// ✅ EXPORT PlanCode (this is what Netlify is demanding)
export type PlanCode = "free" | "starter" | "pro" | "elite";

// ✅ Normalizer used by AccessGate
export function normalizePlan(input: string): PlanCode {
  const v = input.toLowerCase().trim();

  if (v === "starter") return "starter";
  if (v === "pro") return "pro";
  if (v === "elite") return "elite";

  return "free";
}
