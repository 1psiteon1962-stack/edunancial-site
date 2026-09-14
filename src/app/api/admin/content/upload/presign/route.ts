import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { DEFAULT_BATCH_FILE_LIMIT } from "@/lib/admin-content/config";
import { assertValidUploadName, validateBatchSize, validateFileSize } from "@/lib/admin-content/security";
import { parseUploadConfig } from "@/lib/admin-content/upload-intake";
import { recordUploadOperation } from "@/lib/admin-content/upload-operations";
import { createId, slugify } from "@/lib/admin-content/utils";

type FileDescriptor = { name: string; size: number; type: string };
export const maxDuration = 26;

function validateFileDescriptors(fileDescriptors: FileDescriptor[]) {
  if (fileDescriptors.length > DEFAULT_BATCH_FILE_LIMIT) throw new Error(`Upload batch contains too many files (${fileDescriptors.length}). Maximum is ${DEFAULT_BATCH_FILE_LIMIT}.`);
  let totalBytes = 0;
  for (const file of fileDescriptors) {
    if (!file || typeof file.name !== "string" || !file.name.trim()) throw new Error("Every upload must include a valid filename.");
    if (!Number.isFinite(file.size) || file.size < 0) throw new Error(`Invalid upload size for ${file.name}.`);
    assertValidUploadName(file.name);
    validateFileSize(file.size);
    totalBytes += file.size;
  }
  validateBatchSize(totalBytes);
  return totalBytes;
}

export async function POST(request: NextRequest) {
  let batchId: string | null = null;
  try {
    const auth = await requireAdminApiSession(request, true);
    if (!auth.ok) return auth.response;
    const csrfToken = request.headers.get("x-csrf-token") ?? "";
    const body = (await request.json()) as Record<string, unknown> & { files?: unknown };
    const fileDescriptors: FileDescriptor[] = Array.isArray(body.files) ? (body.files as FileDescriptor[]) : [];
    if (!fileDescriptors.length) throw new Error("Select at least one file to upload.");
    const totalBytes = validateFileDescriptors(fileDescriptors);

    const configFormData = new FormData();
    for (const [key, value] of Object.entries(body)) if (key !== "files" && (typeof value === "string" || typeof value === "number")) configFormData.append(key, String(value));
    parseUploadConfig(configFormData);

    const batchName = (String(body.batchName ?? "") || "Content Upload " + new Date().toISOString().slice(0, 10)).trim();
    batchId = createId("batch");
    const batchSlug = slugify(batchName);
    const contentDestination = String(body.contentDestination ?? "").trim() || "uploads";
    await recordUploadOperation({ batchId, phase: "PRESIGN", status: "STARTED", metadata: { fileCount: fileDescriptors.length, totalBytes, contentDestination, preferredPath: "netlify-blobs", atomicPresign: true } });

    const uploads = fileDescriptors.map((file) => {
      const uploadId = createId("upload");
      const safeName = assertValidUploadName(file.name);
      const storagePath = `uploads/${contentDestination}/${batchId}/${uploadId}-${safeName}`;
      const query = new URLSearchParams({ path: storagePath, name: safeName });
      return {
        uploadId,
        storagePath,
        safeName,
        signedUrl: null,
        directUpload: {
          url: `/api/admin/content/upload/blob?${query.toString()}`,
          headers: { "x-csrf-token": csrfToken },
        },
      };
    });

    await recordUploadOperation({ batchId, phase: "PRESIGN", status: "SUCCEEDED", metadata: { fileCount: uploads.length, totalBytes, contentDestination, preferredPath: "netlify-blobs" } });
    return Response.json({ success: true, batchId, batchSlug, uploads }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch (error) {
    const err = error as Error;
    try { await recordUploadOperation({ batchId, phase: "PRESIGN", status: "FAILED", errorCode: err.name, errorMessage: err.message }); } catch {}
    const responseBody: Record<string, unknown> = { success: false, error: err.message ?? "Upload preparation failed.", reason: err.name ?? "UnknownError", status: 400 };
    if (process.env.NODE_ENV !== "production") responseBody.stack = err.stack;
    return Response.json(responseBody, { status: 400, headers: { "Cache-Control": "private, no-store, max-age=0" } });
  }
}
