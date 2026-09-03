import { NextRequest } from "next/server";

import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { normalizeMixedLocaleBatch } from "@/lib/admin-content/batch-locale-normalization";
import { inferCurriculumPackageIdentity } from "@/lib/admin-content/package-upload-config";
import { type StoredUploadEntry } from "@/lib/admin-content/service";
import { createIndependentUploadBatchFromStoredFiles } from "@/lib/admin-content/stored-upload-finalizer";
import { parseUploadConfig } from "@/lib/admin-content/upload-intake";
import { recordUploadOperation } from "@/lib/admin-content/upload-operations";
import { createId } from "@/lib/admin-content/utils";
import { getKpiSupabaseAdmin } from "@/lib/kpi/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type FinalizeBody = {
  batchId: string;
  batchName?: string;
  source?: string;
  notes?: string;
  uploads: StoredUploadEntry[];
  [key: string]: unknown;
};

async function isAlreadyFinalized(batchId: string, uploadId: string): Promise<boolean> {
  const db = getKpiSupabaseAdmin();
  const { data, error } = await db
    .from("admin_upload_operations")
    .select("upload_id")
    .eq("batch_id", batchId)
    .eq("upload_id", uploadId)
    .eq("phase", "FINALIZE")
    .eq("status", "SUCCEEDED")
    .limit(1);
  if (error) throw new Error(`Unable to verify prior finalization: ${error.message}`);
  return Boolean(data?.length);
}

export async function POST(request: NextRequest) {
  let batchId: string | null = null;
  let upload: StoredUploadEntry | null = null;
  try {
    const auth = await requireAdminApiSession(request, true);
    if (!auth.ok) return auth.response;

    const body = (await request.json()) as FinalizeBody;
    batchId = String(body.batchId ?? "").trim();
    if (!batchId) throw new Error("batchId is required.");
    if (!Array.isArray(body.uploads) || body.uploads.length !== 1) {
      return Response.json(
        { success: false, error: "Finalize accepts exactly one stored package per request.", retryable: true, batchId },
        { status: 422, headers: { "Cache-Control": "private, no-store, max-age=0" } },
      );
    }
    upload = body.uploads[0];

    const configFormData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (!["batchId", "batchName", "source", "notes", "uploads"].includes(key) && (typeof value === "string" || typeof value === "number")) {
        configFormData.append(key, String(value));
      }
    }
    const uploadConfig = parseUploadConfig(configFormData);

    if (await isAlreadyFinalized(batchId, upload.uploadId)) {
      return Response.json(
        { success: true, alreadyFinalized: true, uploadId: upload.uploadId, finalizedCount: 0, skippedCount: 1 },
        { status: 200, headers: { "Cache-Control": "private, no-store, max-age=0" } },
      );
    }

    const packageIdentity = uploadConfig.destination === "courses"
      ? inferCurriculumPackageIdentity(upload.originalFilename, uploadConfig.language)
      : null;
    const reviewBatchId = createId("batch");

    await recordUploadOperation({ batchId, uploadId: upload.uploadId, phase: "FINALIZE", status: "STARTED", storagePath: upload.storagePath, fileName: upload.originalFilename, fileSize: upload.sizeBytes, metadata: { mode: "single-package-request", reviewBatchId, packageIdentity } });

    const createdBatch = await createIndependentUploadBatchFromStoredFiles(request, toActor(auth.session), {
      batchId: reviewBatchId,
      batchName: `${String(body.batchName ?? "Content upload")} — ${upload.originalFilename}`,
      source: String(body.source ?? ""),
      notes: String(body.notes ?? ""),
      uploadConfig,
      uploads: [upload],
    });
    const batch = await normalizeMixedLocaleBatch(createdBatch);
    if (batch.uploads.length === 0 || batch.files.length === 0) {
      const detail = batch.warnings.length ? batch.warnings.join(" | ") : "No reviewable files were produced from the uploaded object.";
      throw new Error(`Uploaded file reached storage but could not be processed: ${detail}`);
    }

    await recordUploadOperation({ batchId, uploadId: upload.uploadId, phase: "FINALIZE", status: "SUCCEEDED", storagePath: upload.storagePath, fileName: upload.originalFilename, fileSize: upload.sizeBytes, metadata: { mode: "single-package-request", reviewBatchId: batch.id, reviewableFiles: batch.files.length, packageIdentity } });
    await recordUploadOperation({ batchId, uploadId: upload.uploadId, phase: "VERIFY", status: "SUCCEEDED", storagePath: upload.storagePath, fileName: upload.originalFilename, fileSize: upload.sizeBytes, metadata: { mode: "single-package-request", reviewBatchId: batch.id } });

    return Response.json({ success: true, batch, batches: [batch], finalizedCount: 1, skippedCount: 0, failures: [] }, { status: 201, headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch (error) {
    const err = error as Error;
    try {
      await recordUploadOperation({ batchId, uploadId: upload?.uploadId, phase: "FINALIZE", status: "FAILED", storagePath: upload?.storagePath, fileName: upload?.originalFilename, fileSize: upload?.sizeBytes, errorCode: err.name, errorMessage: err.message, metadata: { mode: "single-package-request" } });
    } catch (auditError) {
      console.error("[finalize] unable to persist failure audit", auditError);
    }
    const body: Record<string, unknown> = {
      success: false,
      error: err.message || "Finalize failed.",
      reason: err.name || "UnknownError",
      status: 400,
      batchId,
      uploadId: upload?.uploadId ?? null,
      uploadReachedStorage: Boolean(batchId),
      retryable: Boolean(batchId),
    };
    if (process.env.NODE_ENV !== "production") body.stack = err.stack;
    return Response.json(body, { status: 400, headers: { "Cache-Control": "private, no-store, max-age=0" } });
  }
}
