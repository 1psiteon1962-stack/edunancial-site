import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { createAdminSignedUploadUrl } from "@/lib/admin-content/storage/signed-upload";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 26;

function safeFilename(value: string) {
  const base = value.trim().split(/[\\/]/u).pop() ?? "source.mp4";
  const safe = base.replace(/[^a-zA-Z0-9._-]/gu, "-").replace(/-+/gu, "-");
  if (!safe || safe.length > 180) throw new Error("Invalid source filename.");
  return safe;
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as { title?: unknown; fileName?: unknown; mimeType?: unknown; byteSize?: unknown };
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const fileName = safeFilename(typeof body.fileName === "string" ? body.fileName : "");
    const mimeType = typeof body.mimeType === "string" ? body.mimeType.trim().toLowerCase() : "";
    const byteSize = Number(body.byteSize);

    if (!title || title.length > 200) throw new Error("Video title is required and must be 200 characters or fewer.");
    if (!(mimeType.startsWith("video/") || mimeType.startsWith("image/"))) throw new Error("A supported image or video MIME type is required.");
    if (!Number.isSafeInteger(byteSize) || byteSize <= 0) throw new Error("A valid source byte size is required.");

    const supabase = getSupabaseAdminClient();
    const { data: project, error: projectError } = await supabase.from("video_projects").insert({ title, created_by: auth.session.email, status: "draft" }).select("id").single();
    if (projectError || !project) throw new Error(projectError?.message ?? "Could not create video project.");

    const storagePath = `projects/${project.id}/raw/${crypto.randomUUID()}-${fileName}`;
    const assetType = mimeType.startsWith("image/") ? "RAW_IMAGE" : "RAW_VIDEO";
    const { data: asset, error: assetError } = await supabase.from("video_assets").insert({ project_id: project.id, asset_type: assetType, storage_bucket: "raw-videos", storage_path: storagePath, original_filename: fileName, mime_type: mimeType, byte_size: byteSize }).select("id").single();
    if (assetError || !asset) {
      await supabase.from("video_projects").delete().eq("id", project.id);
      throw new Error(assetError?.message ?? "Could not create source asset.");
    }

    const signedUploadUrl = await createAdminSignedUploadUrl(storagePath, { bucket: "raw-videos", prefix: null, upsert: false });
    if (!signedUploadUrl) throw new Error("Video signed uploads are not configured.");
    return Response.json({ success: true, projectId: project.id, assetId: asset.id, storagePath, signedUploadUrl }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Video project creation failed." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
  }
}
