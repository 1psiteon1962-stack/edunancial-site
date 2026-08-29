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

type FinalizeFailure = {
  uploadId: string;
  filename: string;
  error: string;
};

async function getFinalizedUploadIds(batchId: string): Promise<Set<string>> {
  const db = getKpiSupabaseAdmin();
  const { data, error } = await db
    .from("admin_upload_operations")
    .select("upload_id")
    .eq("batch_id", batchId)
    .eq("phase", "FINALIZE")
    .eq("status", "SUCCEEDED");

  if (error) {
    console.warn("[finalize] unable to read prior finalization audit", error.message);
    return new Set();
  }

  return new Set(
    ((data ?? []) as Array<{ upload_id: string | null }>)
      .map((row) => row.upload_id)
      .filter((value): value is string => Boolean(value)),
  );
}

export async function POST(request: NextRequest) {
  let batchId: string | null = null;
  try {
    const auth = await requireAdminApiSession(request, true);
    if (!auth.ok) return auth.response;

    const body = (await request.json()) as FinalizeBody;
    batchId = body.batchId;
    const { uploads } = body;
    if (!batchId) throw new Error("batchId is required.");
    if (!Array.isArray(uploads) || !uploads.length) throw new Error("No uploaded files provided.");

    const configFormData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (
        key !== "batchId" &&
        key !== "batchName" &&
        key !== "source" &&
        key !== "notes" &&
        key !== "uploads" &&
        (typeof value === "string" || typeof value === "number")
      ) {
        configFormData.append(key, String(value));
      }
    }
    const uploadConfig = parseUploadConfig(configFormData);
    const alreadyFinalized = await getFinalizedUploadIds(batchId);
    const batches = [] as Awaited<ReturnType<typeof normalizeMixedLocaleBatch>>[];
    const failures: FinalizeFailure[] = [];
    let skipped = 0;

    await recordUploadOperation({
      batchId,
      phase: "FINALIZE",
      status: "STARTED",
      metadata: {
        fileCount: uploads.length,
        mode: "package-by-package",
        alreadyFinalized: alreadyFinalized.size,
      },
    });

    for (const upload of uploads) {
      if (alreadyFinalized.has(upload.uploadId)) {
        skipped += 1;
        continue;
      }

      const packageIdentity = uploadConfig.destination === "courses"
        ? inferCurriculumPackageIdentity(upload.originalFilename, uploadConfig.language)
        : null;
      const reviewBatchId = createId("batch");

      await recordUploadOperation({
        batchId,
        uploadId: upload.uploadId,
        phase: "FINALIZE",
        status: "STARTED",
        storagePath: upload.storagePath,
        fileName: upload.originalFilename,
        fileSize: upload.sizeBytes,
        metadata: {
          mode: "isolated-package",
          reviewBatchId,
          packageIdentity,
        },
      });

      try {
        const createdBatch = await createIndependentUploadBatchFromStoredFiles(
          request,
          toActor(auth.session),
          {
            batchId: reviewBatchId,
            batchName: `${String(body.batchName ?? "Content upload")} — ${upload.originalFilename}`,
            source: String(body.source ?? ""),
            notes: String(body.notes ?? ""),
            uploadConfig,
            uploads: [upload],
          },
        );
        const batch = await normalizeMixedLocaleBatch(createdBatch);

        if (batch.uploads.length === 0 || batch.files.length === 0) {
          const detail = batch.warnings.length
            ? batch.warnings.join(" | ")
            : "No reviewable files were produced from the uploaded object.";
          throw new Error(`Uploaded file reached storage but could not be processed: ${detail}`);
        }

        batches.push(batch);
        await recordUploadOperation({
          batchId,
          uploadId: upload.uploadId,
          phase: "FINALIZE",
          status: "SUCCEEDED",
          storagePath: upload.storagePath,
          fileName: upload.originalFilename,
          fileSize: upload.sizeBytes,
          metadata: {
            mode: "isolated-package",
            reviewBatchId: batch.id,
            reviewableFiles: batch.files.length,
            packageIdentity,
          },
        });
      } catch (error) {
        const err = error as Error;
        failures.push({ uploadId: upload.uploadId, filename: upload.originalFilename, error: err.message });
        await recordUploadOperation({
          batchId,
          uploadId: upload.uploadId,
          phase: "FINALIZE",
          status: "FAILED",
          storagePath: upload.storagePath,
          fileName: upload.originalFilename,
          fileSize: upload.sizeBytes,
          errorCode: err.name,
          errorMessage: err.message,
          metadata: { mode: "isolated-package", reviewBatchId },
        });
      }
    }

    if (batches.length === 0 && failures.length > 0) {
      throw new Error(`No packages finalized successfully. ${failures.map((failure) => `${failure.filename}: ${failure.error}`).join(" | ")}`);
    }

    await recordUploadOperation({
      batchId,
      phase: "VERIFY",
      status: failures.length ? "FAILED" : "SUCCEEDED",
      metadata: {
        mode: "package-by-package",
        requested: uploads.length,
        finalizedNow: batches.length,
        skippedAlreadyFinalized: skipped,
        failed: failures.length,
        reviewBatchIds: batches.map((batch) => batch.id),
      },
    });

    return Response.json(
      {
        success: failures.length === 0,
        partial: failures.length > 0,
        batch: batches[0] ?? null,
        batches,
        finalizedCount: batches.length,
        skippedCount: skipped,
        failures,
      },
      {
        status: failures.length ? 207 : 201,
        headers: { "Cache-Control": "private, no-store, max-age=0" },
      },
    );
  } catch (error) {
    const err = error as Error;
    try {
      await recordUploadOperation({
        batchId,
        phase: "FINALIZE",
        status: "FAILED",
        errorCode: err.name,
        errorMessage: err.message,
      });
    } catch (auditError) {
      console.error("[finalize] unable to persist failure audit", auditError);
    }

    const body: Record<string, unknown> = {
      success: false,
      error: err.message || "Finalize failed.",
      reason: err.name || "UnknownError",
      status: 400,
      batchId,
      uploadReachedStorage: Boolean(batchId),
      retryable: Boolean(batchId),
    };
    if (process.env.NODE_ENV !== "production") body.stack = err.stack;

    return Response.json(body, {
      status: 400,
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  }
}
