export type UserSession = {
  userId: string;
  email: string;
  plan: "FREE" | "STARTER" | "FOUNDER" | "PRO" | "ELITE";
};

export type PlanCode =
  | "free"
  | "starter"
  | "founder"
  | "pro"
  | "elite";

let session: UserSession | null = null;

export function getSession(): UserSession | null {
  return session;
}

export function setSession(next: UserSession): void {
  session = next;
}

export function clearSession(): void {
  session = null;
}

/**
 * Normalizes any session plan into a lowercase PlanCode
 * used by AccessGate / canAccess.
 */
export function normalizePlan(plan: UserSession["plan"]): PlanCode {
  return plan.toLowerCase() as PlanCode;
}
