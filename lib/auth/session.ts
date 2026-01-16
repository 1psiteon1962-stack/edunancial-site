export type Plan = "FREE" | "FOUNDER" | "BUILDER";

export type Session = {
  userId: string;
  email: string;
  plan: Plan;
};

let currentSession: Session | null = null;

export function setSession(session: Session) {
  currentSession = session;
}

export function getSession(): Session | null {
  return currentSession;
}

export function clearSession() {
  currentSession = null;
}
