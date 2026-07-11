export type AuthAuditEvent = {
  action:
    | "register"
    | "login"
    | "logout"
    | "forgot-password"
    | "reset-password"
    | "verify-email"
    | "resend-verification"
    | "profile-update"
    | "authorization-denied";
  success: boolean;
  userId?: string;
  email?: string;
  ip?: string;
  metadata?: Record<string, unknown>;
};

export function logAuthEvent(event: AuthAuditEvent): void {
  console.info(
    JSON.stringify({
      category: "auth",
      timestamp: new Date().toISOString(),
      ...event,
    })
  );
}
