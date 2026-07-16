/**
 * Backward-compatible auth stubs.
 *
 * These stubs are imported by some existing modules (preferences.ts, page.tsx).
 * They return safe null/false values and should be migrated to use
 * getSession() from "@/lib/auth/session" in server components/routes.
 *
 * IMPORTANT: Do not add imports from "next/headers" or "iron-session" here,
 * because this file is imported transitively by client components.
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * @deprecated Use getSession() from "@/lib/auth/session" instead.
 * Always returns false — synchronous stubs cannot read the HttpOnly session cookie.
 */
export function isLoggedIn(): boolean {
  return false;
}

/**
 * @deprecated Use getSession() from "@/lib/auth/session" instead.
 * Always returns null — synchronous stubs cannot read the HttpOnly session cookie.
 */
export function currentUser(): User | null {
  return null;
}
