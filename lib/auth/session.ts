// lib/auth/session.ts

export type UserSession = {
  id?: string;
  email?: string;
  name?: string;
  plan?: string;
};

type SessionState = {
  session: UserSession | null;
};

const STORAGE_KEY = "edunancial_session";

function safeParse(raw: string | null): SessionState {
  if (!raw) return { session: null };
  try {
    const parsed = JSON.parse(raw) as SessionState;
    return parsed && typeof parsed === "object" ? parsed : { session: null };
  } catch {
    return { session: null };
  }
}

export function getSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return safeParse(raw).session ?? null;
}

export function setSession(session: UserSession | null) {
  if (typeof window === "undefined") return;
  const state: SessionState = { session };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
