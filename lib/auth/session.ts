import type { PlanCode } from "@/types/plan";

export type UserSession = {
  id: string;
  email: string;
  plan: "FREE" | "FOUNDER" | "BUILDER";
};

/**
 * Normalize stored session plan → PlanCode
 */
export function normalizePlan(plan: UserSession["plan"]): PlanCode {
  switch (plan) {
    case "FOUNDER":
      return "founder";
    case "BUILDER":
      return "pro";
    case "FREE":
    default:
      return "free";
  }
}

/**
 * LEGACY EXPORT (required by login page)
 */
export function setSession(session: UserSession) {
  if (typeof window !== "undefined") {
    localStorage.setItem("session", JSON.stringify(session));
  }
}

export function getSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("session");
  return raw ? JSON.parse(raw) : null;
}
