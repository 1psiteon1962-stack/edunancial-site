import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { createVideoR2PendingAsset, getVideoR2Project } from "@/lib/video/repository";
import { presignVideoUpload } from "@/lib/video/storage-client";
import { videoMusicKey, videoNarrationKey, videoSourceKey } from "@/lib/video/storage";

function safeFilename(value: string) {
  const base = value.trim().split(/[\\/]/u).pop() ?? "asset";
  const safe = base.replace(/[^a-zA-Z0-9._-]/gu, "-").replace(/-+/gu, "-");
  if (!safe || safe.length > 180) throw new Error("Invalid asset filename.");
  return safe;
}
function extensionFromFilename(fileName: string) {
  const ext = fileName.includes(".") ? fileName.split(".").pop() ?? "" : "";
  if (!/^[a-z0-9]{1,10}$/iu.test(ext)) throw new Error("Asset filename must include a supported extension.");
  return ext;
}
function assetKind(mimeType: string) {
  if (mimeType.startsWith("image/")) return "source_image" as const;
  if (mimeType.startsWith("video/")) return "source_video" as const;
  if (mimeType.startsWith("audio/")) return "narration" as const;
  throw new Error("A supported image, video, or audio MIME type is required.");
}

export async function POST(request: NextRequest, context: { params: Promise<{ projectId: string }> }) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  try {
    const { projectId } = await context.params;
    if (!/^[0-9a-f-]{36}$/iu.test(projectId)) throw new Error("Invalid projectId.");
    const project = await getVideoR2Project(projectId, auth.session.email);
    if (!project) throw new Error("Video project not found.");

    const body = (await request.json()) as { fileName?: unknown; mimeType?: unknown; byteSize?: unknown; role?: unknown; locale?: unknown };
    const fileName = safeFilename(typeof body.fileName === "string" ? body.fileName : "");
    const mimeType = typeof body.mimeType === "string" ? body.mimeType.trim().toLowerCase() : "";
    const byteSize = Number(body.byteSize);
    const inferredKind = assetKind(mimeType);
    if (!Number.isSafeInteger(byteSize) || byteSize <= 0) throw new Error("A valid byte size is required.");

    const assetId = crypto.randomUUID();
    const ext = extensionFromFilename(fileName);
    const requestedRole = typeof body.role === "string" ? body.role : "";
    const kind = inferredKind === "narration" && requestedRole === "music" ? "music" as const : inferredKind;
    const storageKey =
      kind === "music" ? videoMusicKey(projectId, assetId, ext) :
      kind === "narration" ? videoNarrationKey(projectId, assetId, ext) :
      videoSourceKey(projectId, assetId, ext);

    const asset = await createVideoR2PendingAsset({
      id: assetId,
      projectId,
      ownerEmail: auth.session.email,
      kind,
      storageKey,
      mimeType,
      byteSize,
      locale: typeof body.locale === "string" ? body.locale.trim().slice(0, 35) : null,
      originalFilename: fileName,
    });
    if (!asset?.id) throw new Error("Could not register asset.");

    const signedUploadUrl = await presignVideoUpload(storageKey, mimeType, 900);
    return Response.json(
      { success: true, assetId: asset.id, assetType: kind, storagePath: storageKey, storageKey, signedUploadUrl },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Asset creation failed." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
  }
}
