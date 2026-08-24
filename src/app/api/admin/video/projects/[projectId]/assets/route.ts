import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { createAdminSignedUploadUrl } from "@/lib/admin-content/storage/signed-upload";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

function safeFilename(value: string) {
  const base = value.trim().split(/[\\/]/u).pop() ?? "asset";
  const safe = base.replace(/[^a-zA-Z0-9._-]/gu, "-").replace(/-+/gu, "-");
  if (!safe || safe.length > 180) throw new Error("Invalid asset filename.");
  return safe;
}

function assetType(mimeType: string) {
  if (mimeType.startsWith("image/")) return "RAW_IMAGE";
  if (mimeType.startsWith("video/")) return "RAW_VIDEO";
  if (mimeType.startsWith("audio/")) return "RAW_AUDIO";
  throw new Error("A supported image, video, or audio MIME type is required.");
}

export async function POST(request: NextRequest, context: { params: Promise<{ projectId: string }> }) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  try {
    const { projectId } = await context.params;
    if (!/^[0-9a-f-]{36}$/iu.test(projectId)) throw new Error("Invalid projectId.");
    const body = (await request.json()) as { fileName?: unknown; mimeType?: unknown; byteSize?: unknown };
    const fileName = safeFilename(typeof body.fileName === "string" ? body.fileName : "");
    const mimeType = typeof body.mimeType === "string" ? body.mimeType.trim().toLowerCase() : "";
    const byteSize = Number(body.byteSize);
    const type = assetType(mimeType);
    if (!Number.isSafeInteger(byteSize) || byteSize <= 0) throw new Error("A valid byte size is required.");

    const supabase = getSupabaseAdminClient();
    const { data: project, error: projectError } = await supabase.from("video_projects").select("id,created_by").eq("id", projectId).single();
    if (projectError || !project || project.created_by !== auth.session.email) throw new Error("Video project not found.");

    const storagePath = `projects/${projectId}/raw/${crypto.randomUUID()}-${fileName}`;
    const { data: asset, error: assetError } = await supabase.from("video_assets").insert({ project_id: projectId, asset_type: type, storage_bucket: "raw-videos", storage_path: storagePath, original_filename: fileName, mime_type: mimeType, byte_size: byteSize }).select("id").single();
    if (assetError || !asset) throw new Error(assetError?.message ?? "Could not register asset.");
    const signedUploadUrl = await createAdminSignedUploadUrl(storagePath, { bucket: "raw-videos", prefix: null, upsert: false });
    if (!signedUploadUrl) throw new Error("Signed uploads are not configured.");
    return Response.json({ success: true, assetId: asset.id, assetType: type, storagePath, signedUploadUrl }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Asset creation failed." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
  }
}
