import { NextRequest } from "next/server";

import { requireRoleApiSession } from "@/lib/admin-content/auth";
import { createTrack, listTracks } from "@/lib/admin-content/track-storage";

/**
 * GET /api/admin/tracks
 * List all course tracks (active and archived).
 * Requires: owner | admin | editor | instructor
 */
export async function GET(request: NextRequest) {
  const auth = await requireRoleApiSession(request, ["owner", "admin", "editor", "instructor"]);
  if (!auth.ok) return auth.response;

  const tracks = await listTracks();
  return Response.json({ tracks });
}

/**
 * POST /api/admin/tracks
 * Create a new course track.
 * Requires: owner | admin
 */
export async function POST(request: NextRequest) {
  const auth = await requireRoleApiSession(request, ["owner", "admin"], true);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body?.slug || !body?.label) {
    return Response.json({ error: "slug and label are required" }, { status: 400 });
  }

  try {
    const track = await createTrack({
      slug: String(body.slug),
      label: String(body.label),
      color: String(body.color ?? body.slug),
      description: String(body.description ?? ""),
      status: body.status === "archived" ? "archived" : "active",
      order: typeof body.order === "number" ? body.order : 99,
      createdBy: auth.session.email,
    });
    return Response.json({ track }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create track.";
    return Response.json({ error: message }, { status: 409 });
  }
}
