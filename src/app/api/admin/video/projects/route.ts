import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { createVideoR2PendingAsset, createVideoR2Project } from "@/lib/video/repository";
import { presignVideoUpload } from "@/lib/video/storage-client";
import { videoSourceKey } from "@/lib/video/storage";

export const maxDuration = 26;

function safeFilename(value: string) {
  const base = value.trim().split(/[\\/]/u).pop() ?? "source.mp4";
  const safe = base.replace(/[^a-zA-Z0-9._-]/gu, "-").replace(/-+/gu, "-");
  if (!safe || safe.length > 180) throw new Error("Invalid source filename.");
  return safe;
}
function extensionFromFilename(fileName: string) {
  const ext = fileName.includes(".") ? fileName.split(".").pop() ?? "" : "";
  if (!/^[a-z0-9]{1,10}$/iu.test(ext)) throw new Error("Source filename must include a supported extension.");
  return ext;
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

    const project = await createVideoR2Project({
      title,
      ownerEmail: auth.session.email,
      purpose: "marketing",
      defaultLocale: "en-US",
      outputProfile: "vertical_1080x1920",
    });
    if (!project?.id) throw new Error("Could not create video project.");

    const assetId = crypto.randomUUID();
    const storageKey = videoSourceKey(String(project.id), assetId, extensionFromFilename(fileName));
    const asset = await createVideoR2PendingAsset({
      id: assetId,
      projectId: String(project.id),
      ownerEmail: auth.session.email,
      kind: mimeType.startsWith("image/") ? "source_image" : "source_video",
      storageKey,
      mimeType,
      byteSize,
      originalFilename: fileName,
    });
    if (!asset?.id) throw new Error("Could not register source asset.");

    const signedUploadUrl = await presignVideoUpload(storageKey, mimeType, 900);
    return Response.json(
      { success: true, projectId: project.id, assetId: asset.id, storagePath: storageKey, storageKey, signedUploadUrl },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Video project creation failed." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
  }
}
