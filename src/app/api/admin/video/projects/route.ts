import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { createAdminSignedUploadUrl } from "@/lib/admin-content/storage/signed-upload";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 26;

function safeFilename(value: string) {
  const base = value.trim().split(/[\\/]/u).pop() ?? "video.mp4";
  const safe = base.replace(/[^a-zA-Z0-9._-]/gu, "-").replace(/-+/gu, "-");
  if (!safe || safe.length > 180) throw new Error("Invalid video filename.");
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
    if (!mimeType.startsWith("video/")) throw new Error("A video MIME type is required.");
    if (!Number.isSafeInteger(byteSize) || byteSize <= 0) throw new Error("A valid video byte size is required.");

    const supabase = getSupabaseAdminClient();
    const { data: project, error: projectError } = await supabase
      .from("video_projects")
      .insert({ title, created_by: auth.session.email, status: "draft" })
      .select("id")
      .single();
    if (projectError || !project) throw new Error(projectError?.message ?? "Could not create video project.");

    const storagePath = `projects/${project.id}/raw/${crypto.randomUUID()}-${fileName}`;
    const { data: asset, error: assetError } = await supabase
      .from("video_assets")
      .insert({ project_id: project.id, asset_type: "RAW_VIDEO", storage_bucket: "raw-videos", storage_path: storagePath, original_filename: fileName, mime_type: mimeType, byte_size: byteSize })
      .select("id")
      .single();
    if (assetError || !asset) {
      await supabase.from("video_projects").delete().eq("id", project.id);
      throw new Error(assetError?.message ?? "Could not create raw video asset.");
    }

    const signedUploadUrl = await createAdminSignedUploadUrlForVideo(storagePath);
    return Response.json({ success: true, projectId: project.id, assetId: asset.id, storagePath, signedUploadUrl }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Video project creation failed." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
  }
}

async function createAdminSignedUploadUrlForVideo(storagePath: string) {
  // The existing helper is bound to the general admin upload bucket, so R1 keeps
  // the same server-only credential pattern while targeting the dedicated bucket.
  if ((process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET ?? "") === "raw-videos") {
    return createAdminSignedUploadUrl(storagePath);
  }
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.storage.from("raw-videos").createSignedUploadUrl(storagePath, { upsert: false });
  if (error || !data?.signedUrl) throw new Error(error?.message ?? "Could not create video upload URL.");
  return data.signedUrl;
}
