import { NextRequest } from "next/server";

import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { normalizeMixedLocaleBatch } from "@/lib/admin-content/batch-locale-normalization";
import { inferCurriculumPackageIdentity } from "@/lib/admin-content/package-upload-config";
import { type StoredUploadEntry } from "@/lib/admin-content/service";
import { createIndependentUploadBatchFromStoredFiles } from "@/lib/admin-content/stored-upload-finalizer";
import { parseUploadConfig } from "@/lib/admin-content/upload-intake";
import { recordUploadOperation } from "@/lib/admin-content/upload-operations";

// The browser has already completed the direct-to-storage transfer when this
// route begins. Finalization may still need to re-read the object, validate and
// extract an archive, inspect prior batches for conflicts, write audit records,
// and persist the review batch. Give that work enough room to complete instead
// of turning a valid 90%-complete upload into a timeout failure.
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

    await recordUploadOperation({
      batchId,
      phase: "FINALIZE",
      status: "STARTED",
      metadata: { fileCount: uploads.length },
    });

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

    // Curriculum batches are many independent packages, not one course with
    // several attachments. Validate every package identity before extraction so
    // an ambiguous ZIP can never inherit another package's color/level/language.
    const packageIdentities = uploadConfig.destination === "courses"
      ? uploads.map((upload) => ({
          uploadId: upload.uploadId,
          filename: upload.originalFilename,
          ...inferCurriculumPackageIdentity(upload.originalFilename),
        }))
      : [];

    if (packageIdentities.length > 0) {
      await recordUploadOperation({
        batchId,
        phase: "FINALIZE",
        status: "STARTED",
        metadata: {
          fileCount: uploads.length,
          curriculumPackages: packageIdentities.map((identity) => ({
            uploadId: identity.uploadId,
            filename: identity.filename,
            track: identity.track,
            level: identity.level,
            language: identity.language,
            title: identity.title,
          })),
        },
      });
    }

    // This production path resolves a package-specific configuration before
    // extracting each stored ZIP. The batch-level configuration is only a base;
    // it is never used to stamp every curriculum package with the same identity.
    const createdBatch = await createIndependentUploadBatchFromStoredFiles(
      request,
      toActor(auth.session),
      {
        batchId,
        batchName: String(body.batchName ?? ""),
        source: String(body.source ?? ""),
        notes: String(body.notes ?? ""),
        uploadConfig,
        uploads,
      },
    );
    const batch = await normalizeMixedLocaleBatch(createdBatch);

    // A direct upload is not successful merely because the object reached storage.
    // If every supplied object failed validation/extraction, fail finalization and keep
    // the object available for retry/diagnosis instead of creating an empty batch.
    if (batch.uploads.length === 0 || batch.files.length === 0) {
      const detail = batch.warnings.length
        ? batch.warnings.join(" | ")
        : "No reviewable files were produced from the uploaded object(s).";
      throw new Error(`Uploaded file reached storage but could not be processed: ${detail}`);
    }

    await recordUploadOperation({
      batchId,
      phase: "FINALIZE",
      status: "SUCCEEDED",
      metadata: {
        fileCount: uploads.length,
        reviewableFiles: batch.files.length,
        independentlyClassifiedPackages: packageIdentities.length,
      },
    });

    return Response.json(
      { success: true, batch },
      { status: 201, headers: { "Cache-Control": "private, no-store, max-age=0" } },
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
