import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "./token";
import { SESSION_COOKIE_NAME } from "./session";
import { isAdministrator } from "./roles";

/**
 * Server-side guard for admin-only routes.
 * Reads the session cookie directly via next/headers and redirects
 * to /login if the user is not an authenticated administrator.
 */
export async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session || !isAdministrator(session.role)) {
    redirect("/login");
  }
}
