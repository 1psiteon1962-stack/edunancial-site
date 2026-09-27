import { randomUUID } from "node:crypto";
import { createVideoR2PendingAsset, getVideoR2Asset, markVideoR2AssetReady, type VideoR2UploadAssetKind } from "./repository";
import { presignVideoUpload, verifyVideoObject } from "./storage-client";
import { videoMusicKey, videoNarrationKey, videoSourceKey } from "./storage";

export type RegisterVideoR2UploadInput = {
  projectId: string;
  ownerEmail: string;
  kind: VideoR2UploadAssetKind;
  extension: string;
  mimeType: string;
  byteSize: number;
  locale?: string | null;
  originalFilename?: string | null;
};

function uploadKey(kind: VideoR2UploadAssetKind, projectId: string, assetId: string, extension: string): string {
  if (kind === "narration") return videoNarrationKey(projectId, assetId, extension);
  if (kind === "music") return videoMusicKey(projectId, assetId, extension);
  return videoSourceKey(projectId, assetId, extension);
}

export async function registerVideoR2Upload(input: RegisterVideoR2UploadInput) {
  if (!Number.isSafeInteger(input.byteSize) || input.byteSize <= 0) throw new Error("Video asset byte size must be positive.");
  if (!input.mimeType.trim()) throw new Error("Video asset MIME type is required.");
  const assetId = randomUUID();
  const storageKey = uploadKey(input.kind, input.projectId, assetId, input.extension);
  const asset = await createVideoR2PendingAsset({ ...input, id: assetId, storageKey });
  if (!asset) return null;
  const uploadUrl = await presignVideoUpload(storageKey, input.mimeType);
  return { asset, uploadUrl };
}

export async function finalizeVideoR2Upload(assetId: string, ownerEmail: string) {
  const asset = await getVideoR2Asset(assetId, ownerEmail);
  if (!asset || asset.status !== "pending_upload") return null;
  const verified = await verifyVideoObject(String(asset.storage_key), Number(asset.byte_size));
  return markVideoR2AssetReady(assetId, ownerEmail, verified);
}
