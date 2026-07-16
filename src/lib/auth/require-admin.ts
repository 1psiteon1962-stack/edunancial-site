/**
 * Server-side admin authorization helper.
 *
 * Usage in API routes:
 *   const admin = await requireAdmin();
 *   if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
 */

import { getSession } from "./session";

export async function requireAdmin(): Promise<{ memberId: string; email: string } | null> {
  try {
    const session = await getSession();
    if (
      session.isLoggedIn &&
      session.memberId &&
      session.email &&
      (session.role === "administrator" || session.role === "staff")
    ) {
      return { memberId: session.memberId, email: session.email };
    }
    return null;
  } catch {
    return null;
  }
}
