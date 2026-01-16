import type { PlanCode } from "@/types/plan";

export type UserSession = {
  id: string;
  email: string;
  plan: "FREE" | "FOUNDER" | "BUILDER";
};

export function normalizePlan(plan: UserSession["plan"]): PlanCode {
  switch (plan) {
    case "FOUNDER":
      return "founder";
    case "BUILDER":
      return "pro";
    case "FREE":
    default:
      return "starter";
  }
}
