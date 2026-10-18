import type { StoredUploadEntry } from "@/lib/admin-content/service";

export type FinalizeBody = {
  batchId: string;
  batchName?: string;
  source?: string;
  notes?: string;
  uploads: StoredUploadEntry[];
  [key: string]: unknown;
};

export type FinalizeBodyValidation =
  | { ok: true; body: FinalizeBody }
  | { ok: false; error: string };

/** Validate shape before opening an upload receipt, creating a batch, or retrying. */
export function validateFinalizeBody(candidate: unknown): FinalizeBodyValidation {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    return { ok: false, error: "Request body must be a JSON object." };
  }
  const value = candidate as Record<string, unknown>;
  if (typeof value.batchId !== "string" || !value.batchId.trim()) {
    return { ok: false, error: "batchId is required." };
  }
  if (!Array.isArray(value.uploads) || value.uploads.length !== 1) {
    return { ok: false, error: "Finalize accepts exactly one stored package per request." };
  }
  const raw = value.uploads[0];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "Stored package metadata is invalid." };
  }
  const item = raw as Record<string, unknown>;
  if (
    typeof item.uploadId !== "string" || !item.uploadId.trim()
    || typeof item.storagePath !== "string" || !item.storagePath.trim()
    || typeof item.originalFilename !== "string" || !item.originalFilename.trim()
    || typeof item.mimeType !== "string" || !item.mimeType.trim()
    || typeof item.sizeBytes !== "number" || !Number.isFinite(item.sizeBytes) || item.sizeBytes <= 0
  ) {
    return { ok: false, error: "Stored package metadata is invalid." };
  }
  return {
    ok: true,
    body: {
      ...value,
      batchId: value.batchId.trim(),
      uploads: [{
        uploadId: item.uploadId,
        storagePath: item.storagePath,
        originalFilename: item.originalFilename,
        mimeType: item.mimeType,
        sizeBytes: item.sizeBytes,
      }],
    },
  };
}
