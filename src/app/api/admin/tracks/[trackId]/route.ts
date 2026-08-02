import { NextRequest } from "next/server";

import { requireRoleApiSession } from "@/lib/admin-content/auth";
import { deleteTrack, getTrack, updateTrack } from "@/lib/admin-content/track-storage";

/**
 * GET /api/admin/tracks/[trackId]
 * Requires: owner | admin | editor | instructor
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackId: string }> },
) {
  const auth = await requireRoleApiSession(request, ["owner", "admin", "editor", "instructor"]);
  if (!auth.ok) return auth.response;

  const { trackId } = await params;
  const track = await getTrack(trackId);
  if (!track) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ track });
}

/**
 * PATCH /api/admin/tracks/[trackId]
 * Update track label, color, description, status, or order.
 * Requires: owner | admin
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ trackId: string }> },
) {
  const auth = await requireRoleApiSession(request, ["owner", "admin"], true);
  if (!auth.ok) return auth.response;

  const { trackId } = await params;
  const body = await request.json().catch(() => null);

  const patch: Parameters<typeof updateTrack>[1] = {};
  if (body?.label !== undefined) patch.label = String(body.label);
  if (body?.color !== undefined) patch.color = String(body.color);
  if (body?.description !== undefined) patch.description = String(body.description);
  if (body?.status === "active" || body?.status === "archived") patch.status = body.status;
  if (typeof body?.order === "number") patch.order = body.order;

  const updated = await updateTrack(trackId, patch);
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ track: updated });
}

/**
 * DELETE /api/admin/tracks/[trackId]
 * Delete a non-default track. Owner-only.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ trackId: string }> },
) {
  const auth = await requireRoleApiSession(request, ["owner"], true);
  if (!auth.ok) return auth.response;

  const { trackId } = await params;
  try {
    const deleted = await deleteTrack(trackId);
    if (!deleted) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete track.";
    return Response.json({ error: message }, { status: 400 });
  }
}
