export type UserSession = {
  userId: string;
  email: string;
  plan: "FREE" | "FOUNDER" | "BUILDER";
};

const STORAGE_KEY = "edunancial_session";

export function getSession(): UserSession | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function setSession(session: UserSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
