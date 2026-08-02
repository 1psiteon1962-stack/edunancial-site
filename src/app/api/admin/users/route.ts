import { NextRequest } from "next/server";

import { requireRoleApiSession } from "@/lib/admin-content/auth";
import {
  createAdminUser,
  listAdminUsers,
} from "@/lib/admin-content/user-storage";
import { ALL_ROLES } from "@/lib/rbac/permissions";
import type { AdminRole } from "@/lib/admin-content/types";

/**
 * GET /api/admin/users
 * List all admin-managed user records.
 * Requires: owner | admin
 */
export async function GET(request: NextRequest) {
  const auth = await requireRoleApiSession(request, ["owner", "admin"]);
  if (!auth.ok) return auth.response;

  const users = await listAdminUsers();
  return Response.json({ users });
}

/**
 * POST /api/admin/users
 * Create a new admin-managed user record with a specific role.
 * Requires: owner | admin
 */
export async function POST(request: NextRequest) {
  const auth = await requireRoleApiSession(request, ["owner", "admin"], true);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body?.email) {
    return Response.json({ error: "email is required" }, { status: 400 });
  }

  const role: AdminRole = ALL_ROLES.includes(body.role as AdminRole)
    ? (body.role as AdminRole)
    : "member";

  // Only the owner can assign the owner role.
  if (role === "owner" && auth.session.role !== "owner") {
    return Response.json({ error: "Only the owner can assign the owner role." }, { status: 403 });
  }

  try {
    const user = await createAdminUser({
      email: String(body.email),
      role,
      notes: String(body.notes ?? ""),
      createdBy: auth.session.email,
    });
    return Response.json({ user }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create user.";
    return Response.json({ error: message }, { status: 409 });
  }
}
