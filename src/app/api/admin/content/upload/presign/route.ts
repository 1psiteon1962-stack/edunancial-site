/**
 * POST /api/admin/content/upload/presign
 *
 * Bulk curriculum uploads must use direct-to-storage signed URLs as one
 * coherent batch. A partially presigned batch is rejected instead of silently
 * downgrading every file to the serverless multipart fallback; that fallback
 * made otherwise-valid multi-file/50-lesson packages unreliable in production.
 */
import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { DEFAULT_BATCH_FILE_LIMIT } from "@/lib/admin-content/config";
import {
  assertValidUploadName,
  validateBatchSize,
  validateFileSize,
} from "@/lib/admin-content/security";
import { createAdminSignedUploadUrl } from "@/lib/admin-content/storage/signed-upload";
import { parseUploadConfig } from "@/lib/admin-content/upload-intake";
import { recordUploadOperation } from "@/lib/admin-content/upload-operations";
import { createId, slugify } from "@/lib/admin-content/utils";

type FileDescriptor = { name: string; size: number; type: string };
export const maxDuration = 26;

function validateFileDescriptors(fileDescriptors: FileDescriptor[]) {
  if (fileDescriptors.length > DEFAULT_BATCH_FILE_LIMIT) {
    throw new Error(`Upload batch contains too many files (${fileDescriptors.length}). Maximum is ${DEFAULT_BATCH_FILE_LIMIT}.`);
  }

  let totalBytes = 0;
  for (const file of fileDescriptors) {
    if (!file || typeof file.name !== "string" || !file.name.trim()) {
      throw new Error("Every upload must include a valid filename.");
    }
    if (!Number.isFinite(file.size) || file.size < 0) {
      throw new Error(`Invalid upload size for ${file.name}.`);
    }

    assertValidUploadName(file.name);
    validateFileSize(file.size);
    totalBytes += file.size;
  }
  validateBatchSize(totalBytes);

  return totalBytes;
}

async function checkSupabaseConnectivity(): Promise<void> {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim().replace(/\/+$/u, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const checkKey = serviceRoleKey || anonKey;
  const bucket = process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET ?? process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY ?? "";

  if (!supabaseUrl || !serviceRoleKey || !bucket) {
    throw new Error("Direct upload storage is not fully configured. NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and EDUNANCIAL_UPLOAD_STORAGE_BUCKET are required for reliable bulk uploads.");
  }

  const response = await fetch(`${supabaseUrl}/storage/v1/bucket/${encodeURIComponent(bucket)}`, {
    method: "GET",
    headers: { Authorization: "Bearer " + checkKey, apikey: checkKey },
    cache: "no-store",
  }).catch(() => null);

  if (!response) {
    throw new Error("Supabase upload storage is unreachable. Bulk upload was stopped before any files were transferred.");
  }
  if ((response.headers.get("content-type") ?? "").toLowerCase().includes("text/html")) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL appears to be misconfigured or points to the wrong host/Netlify site URL; the Supabase bucket endpoint returned text/html.");
  }
  if (!response.ok) {
    throw new Error(`Supabase upload storage readiness check failed (HTTP ${response.status}). Bulk upload was stopped before transfer.`);
  }
}

export async function POST(request: NextRequest) {
  let batchId: string | null = null;
  try {
    const auth = await requireAdminApiSession(request, true);
    if (!auth.ok) return auth.response;

    const body = (await request.json()) as Record<string, unknown> & { files?: unknown };
    const fileDescriptors: FileDescriptor[] = Array.isArray(body.files) ? (body.files as FileDescriptor[]) : [];
    if (!fileDescriptors.length) throw new Error("Select at least one file to upload.");
    const totalBytes = validateFileDescriptors(fileDescriptors);

    const configFormData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (key !== "files" && (typeof value === "string" || typeof value === "number")) configFormData.append(key, String(value));
    }
    parseUploadConfig(configFormData);
    await checkSupabaseConnectivity();

    const batchName = (String(body.batchName ?? "") || "Content Upload " + new Date().toISOString().slice(0, 10)).trim();
    batchId = createId("batch");
    const batchSlug = slugify(batchName);
    const contentDestination = String(body.contentDestination ?? "").trim() || "uploads";

    await recordUploadOperation({
      batchId,
      phase: "PRESIGN",
      status: "STARTED",
      metadata: {
        fileCount: fileDescriptors.length,
        totalBytes,
        contentDestination,
        preferredPath: "direct-storage",
        atomicPresign: true,
      },
    });

    const uploads = [];
    for (const file of fileDescriptors) {
      const uploadId = createId("upload");
      const safeName = assertValidUploadName(file.name);
      const storagePath = "uploads/" + contentDestination + "/" + batchId + "/" + uploadId + "-" + safeName;
      try {
        const signedUrl = await createAdminSignedUploadUrl(storagePath);
        if (!signedUrl) throw new Error("Signed upload URL was not returned by storage.");
        uploads.push({ uploadId, storagePath, safeName, signedUrl, directUpload: null });
        await recordUploadOperation({ batchId, uploadId, phase: "PRESIGN", status: "SUCCEEDED", storagePath, fileName: safeName, fileSize: file.size });
      } catch (error) {
        const err = error as Error;
        await recordUploadOperation({ batchId, uploadId, phase: "PRESIGN", status: "FAILED", storagePath, fileName: safeName, fileSize: file.size, errorCode: err.name, errorMessage: err.message });
        throw new Error(`Bulk upload preparation failed for ${safeName}: ${err.message}. No files should be uploaded from this batch; retry after storage is healthy.`);
      }
    }

    return Response.json({ success: true, batchId, batchSlug, uploads }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch (error) {
    const err = error as Error;
    await recordUploadOperation({ batchId, phase: "PRESIGN", status: "FAILED", errorCode: err.name, errorMessage: err.message });
    const responseBody: Record<string, unknown> = { success: false, error: err.message ?? "Presign failed.", reason: err.name ?? "UnknownError", status: 400 };
    if (process.env.NODE_ENV !== "production") responseBody.stack = err.stack;
    return Response.json(responseBody, { status: 400, headers: { "Cache-Control": "private, no-store, max-age=0" } });
  }
}
