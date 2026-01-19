export type PlanCode =
  | "FREE"
  | "BASIC"
  | "PRO"
  | "ENTERPRISE";

export function normalizePlan(input: string | null | undefined): PlanCode {
  if (!input) return "FREE";

  const value = input.toUpperCase();

  switch (value) {
    case "BASIC":
      return "BASIC";
    case "PRO":
      return "PRO";
    case "ENTERPRISE":
      return "ENTERPRISE";
    case "FREE":
    default:
      return "FREE";
  }
}
