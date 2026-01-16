export type UserSession = {
  userId: string;
  email: string;
  plan: "FREE" | "STARTER" | "FOUNDER" | "PRO" | "ELITE";
};

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
