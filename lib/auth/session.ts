export interface UserSession {
  userId: string;
  email: string;
  plan: "FREE" | "L1" | "L2" | "L3" | "L4" | "L5";
}

export function getSession(): UserSession | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("edunancial_session");
  return raw ? JSON.parse(raw) : null;
}

export function setSession(session: UserSession) {
  localStorage.setItem("edunancial_session", JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem("edunancial_session");
}
