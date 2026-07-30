import { getAdminSession } from "@/lib/admin-content/auth";
import { bypassesPaywall } from "@/lib/rbac/permissions";

/**
 * GET /api/admin/auth/admin-status
 *
 * Returns the current admin session role (if any) so the member-facing
 * frontend can determine whether to bypass paywall restrictions for
 * owner / admin / editor / instructor sessions.
 *
 * This endpoint is intentionally read-only and does not expose secrets or
 * credential details — it only surfaces the role name from the signed,
 * server-verified session cookie.
 */
export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return Response.json({ authenticated: false, role: null, bypassPaywall: false });
  }

  const role = session.role ?? "admin";
  return Response.json({
    authenticated: true,
    role,
    bypassPaywall: bypassesPaywall(role),
  });
}
