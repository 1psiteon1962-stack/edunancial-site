import { NextRequest } from "next/server";

import { requireRoleApiSession } from "@/lib/admin-content/auth";
import {
  deleteAdminUser,
  getAdminUser,
  updateAdminUser,
} from "@/lib/admin-content/user-storage";
import { ALL_ROLES } from "@/lib/rbac/permissions";
import type { AdminRole } from "@/lib/admin-content/types";

/**
 * GET /api/admin/users/[userId]
 * Get a single admin-managed user record.
 * Requires: owner | admin
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const auth = await requireRoleApiSession(request, ["owner", "admin"]);
  if (!auth.ok) return auth.response;

  const { userId } = await params;
  const user = await getAdminUser(userId);
  if (!user) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ user });
}

/**
 * PATCH /api/admin/users/[userId]
 * Update a user's role or notes.
 * Requires: owner | admin
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const auth = await requireRoleApiSession(request, ["owner", "admin"], true);
  if (!auth.ok) return auth.response;

  const { userId } = await params;

  const body = await request.json().catch(() => null);
  const patch: Partial<{ role: AdminRole; notes: string }> = {};

  if (body?.role !== undefined) {
    if (!ALL_ROLES.includes(body.role as AdminRole)) {
      return Response.json({ error: "Invalid role." }, { status: 400 });
    }
    // Only the owner can assign or revoke the owner role.
    if (
      (body.role === "owner" || body.role === "admin") &&
      auth.session.role !== "owner"
    ) {
      return Response.json(
        { error: "Only the owner can assign owner or admin roles." },
        { status: 403 },
      );
    }
    patch.role = body.role as AdminRole;
  }

  if (body?.notes !== undefined) {
    patch.notes = String(body.notes);
  }

  const updated = await updateAdminUser(userId, patch);
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ user: updated });
}

/**
 * DELETE /api/admin/users/[userId]
 * Remove a user record. Owner-only.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const auth = await requireRoleApiSession(request, ["owner"], true);
  if (!auth.ok) return auth.response;

  const { userId } = await params;
  const deleted = await deleteAdminUser(userId);
  if (!deleted) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ ok: true });
}
