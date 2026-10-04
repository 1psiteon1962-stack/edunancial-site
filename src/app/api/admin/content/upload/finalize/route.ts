import { NextRequest } from "next/server";

import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { normalizeMixedLocaleBatch } from "@/lib/admin-content/batch-locale-normalization";
import { inferCurriculumPackageIdentity } from "@/lib/admin-content/package-upload-config";
import { type StoredUploadEntry } from "@/lib/admin-content/service";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import { createIndependentUploadBatchFromStoredFiles } from "@/lib/admin-content/stored-upload-finalizer";
import { autoPublishTrustedCanonicalCurriculumBatch, isTrustedCanonicalCurriculumIdentity } from "@/lib/admin-content/trusted-canonical-ingest";
import { autoPublishTrustedLocalizedLevel1Batch, isTrustedLocalizedLevel1Identity } from "@/lib/admin-content/trusted-localized-ingest";
import { parseUploadConfig } from "@/lib/admin-content/upload-intake";
import { recordUploadOperation } from "@/lib/admin-content/upload-operations";
import { createId } from "@/lib/admin-content/utils";
import { beginFinalization, getUploadReceipt, markFailed, markPublished } from "@/lib/admin-content/upload-receipts";
import { PublicationBusyError, withPublicationLease } from "@/lib/admin-content/publication-lock";
import { verifyLearnerVisibility } from "@/lib/admin-content/learner-readback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type FinalizeBody = { batchId: string; batchName?: string; source?: string; notes?: string; uploads: StoredUploadEntry[]; [key: string]: unknown };

async function getAlreadyFinalizedReviewBatchId(batchId: string, uploadId: string): Promise<string | null> {
  try {
    const events = await getAdminContentStorage().listAuditHistory(batchId);
    for (const event of events) {
      const metadata = event.metadata;
      if (!metadata || metadata.kind !== "upload-operation" || metadata.phase !== "FINALIZE" || metadata.status !== "SUCCEEDED" || metadata.uploadId !== uploadId) continue;
      const reviewBatchId = metadata.reviewBatchId;
      if (typeof reviewBatchId === "string" && reviewBatchId.trim()) return reviewBatchId;
    }
  } catch (error) {
    console.warn("[finalize] GitHub-backed upload audit unavailable; continuing safely", error);
  }
  return null;
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  const batchId = request.nextUrl.searchParams.get("batchId")?.trim() ?? "";
  const uploadId = request.nextUrl.searchParams.get("uploadId")?.trim() ?? "";
  if (!batchId || !uploadId) return Response.json({ success: false, error: "batchId and uploadId are required." }, { status: 400 });
  const receipt = await getUploadReceipt(uploadId);
  if (receipt) return Response.json({ success: true, status: receipt.state, reviewBatchId: receipt.reviewBatchId, receipt }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
  const events = await getAdminContentStorage().listAuditHistory(batchId);
  const latest = events.find((event) => event.metadata?.kind === "upload-operation" && event.metadata?.phase === "FINALIZE" && event.metadata?.uploadId === uploadId)?.metadata;
  const reviewBatchId = typeof latest?.reviewBatchId === "string" ? latest.reviewBatchId : null;
  return Response.json({ success: true, status: latest?.status ?? "NOT_STARTED", reviewBatchId }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
}

export async function POST(request: NextRequest) {
  let batchId: string | null = null;
  let upload: StoredUploadEntry | null = null;
  try {
    const auth = await requireAdminApiSession(request, true);
    if (!auth.ok) return auth.response;
    const actor = toActor(auth.session);
    const body = (await request.json()) as FinalizeBody;
    batchId = String(body.batchId ?? "").trim();
    if (!batchId) throw new Error("batchId is required.");
    if (!Array.isArray(body.uploads) || body.uploads.length !== 1) return Response.json({ success: false, error: "Finalize accepts exactly one stored package per request.", retryable: true, batchId }, { status: 422, headers: { "Cache-Control": "private, no-store, max-age=0" } });
    upload = body.uploads[0];

    const configFormData = new FormData();
    for (const [key, value] of Object.entries(body)) if (!["batchId", "batchName", "source", "notes", "uploads"].includes(key) && (typeof value === "string" || typeof value === "number")) configFormData.append(key, String(value));
    const uploadConfig = parseUploadConfig(configFormData);
    const packageIdentity = uploadConfig.destination === "courses" ? inferCurriculumPackageIdentity(upload.originalFilename, uploadConfig.language) : null;
    const trustedLocalized = isTrustedLocalizedLevel1Identity(packageIdentity);
    const trustedCanonical = isTrustedCanonicalCurriculumIdentity(packageIdentity);

    // Finalization is idempotent for every stored package, including trusted
    // curriculum. Retrying a successful trusted upload must not create a second
    // review batch, atomic publication, or Git publication PR.
    const existingReceipt = await getUploadReceipt(upload.uploadId);
    if (existingReceipt?.state === "PUBLISHED" && existingReceipt.reviewBatchId) {
      return Response.json({ success: true, alreadyFinalized: true, uploadId: upload.uploadId, batch: { id: existingReceipt.reviewBatchId }, batches: [{ id: existingReceipt.reviewBatchId }], finalizedCount: 0, skippedCount: 1, receipt: existingReceipt }, { status: 200, headers: { "Cache-Control": "private, no-store, max-age=0" } });
    }
    const existingReviewBatchId = await getAlreadyFinalizedReviewBatchId(batchId, upload.uploadId);
    if (existingReviewBatchId) {
      return Response.json({ success: true, alreadyFinalized: true, uploadId: upload.uploadId, batch: { id: existingReviewBatchId }, batches: [{ id: existingReviewBatchId }], finalizedCount: 0, skippedCount: 1 }, { status: 200, headers: { "Cache-Control": "private, no-store, max-age=0" } });
    }

    const reviewBatchId = createId("batch");
    await beginFinalization({ uploadId: upload.uploadId, originalBatchId: batchId, storagePath: upload.storagePath, originalFilename: upload.originalFilename, coordinate: packageIdentity ? `${packageIdentity.track}:${packageIdentity.level}:${packageIdentity.language}` : null }, reviewBatchId, "finalize");
    await recordUploadOperation({ batchId, uploadId: upload.uploadId, phase: "FINALIZE", status: "STARTED", storagePath: upload.storagePath, fileName: upload.originalFilename, fileSize: upload.sizeBytes, metadata: { mode: "single-package-request", reviewBatchId, packageIdentity } });

    const createdBatch = await createIndependentUploadBatchFromStoredFiles(request, actor, { batchId: reviewBatchId, batchName: `${String(body.batchName ?? "Content upload")} — ${upload.originalFilename}`, source: String(body.source ?? ""), notes: String(body.notes ?? ""), uploadConfig, uploads: [upload] });
    const batch = await normalizeMixedLocaleBatch(createdBatch);
    if (batch.uploads.length === 0 || batch.files.length === 0) {
      const detail = batch.warnings.length ? batch.warnings.join(" | ") : "No reviewable files were produced from the uploaded object.";
      throw new Error(`Uploaded file reached GitHub storage but could not be processed: ${detail}`);
    }

    const { trustedLocalization, trustedCanonicalPublication } = await withPublicationLease(`finalize:${upload.uploadId}`, async () => ({
      trustedLocalization: await autoPublishTrustedLocalizedLevel1Batch(batch, packageIdentity, { requireAtomic: true }),
      trustedCanonicalPublication: await autoPublishTrustedCanonicalCurriculumBatch(batch, packageIdentity, actor, { requireAtomic: true }),
    }));
    const trustedPublicationAttempted = trustedLocalization.attempted || trustedCanonicalPublication.attempted;

    if (trustedPublicationAttempted && packageIdentity) {
      const verification = await verifyLearnerVisibility(batch, packageIdentity);
      if (!verification.learnerVisible) {
        throw new Error(`Learner verification failed: ${verification.detail}`);
      }
      await markPublished(upload.uploadId, { reviewBatchId: batch.id, verification, githubExportRequired: true, recoveredWithoutReupload: false });
    } else {
      await markPublished(upload.uploadId, { reviewBatchId: batch.id, verification: { learnerVisible: true, detail: "No trusted curriculum publication required.", checkedLessons: 0, checkedAt: new Date().toISOString() }, githubExportRequired: false, recoveredWithoutReupload: false });
    }

    // Atomic learner publication is the durable finalization boundary. GitHub
    // export is a second remote operation and must never turn a successfully
    // stored, validated, and atomically published package back into a failed
    // upload. Persist FINALIZE success first so a slow/failed GitHub request
    // cannot strand the stored ZIP or cause a duplicate recovery attempt.
    await recordUploadOperation({ batchId, uploadId: upload.uploadId, phase: "FINALIZE", status: "SUCCEEDED", storagePath: upload.storagePath, fileName: upload.originalFilename, fileSize: upload.sizeBytes, metadata: { mode: "single-package-request", reviewBatchId: batch.id, reviewableFiles: batch.files.length, packageIdentity, trustedLocalization, trustedCanonicalPublication, githubPublication: null, githubPublicationPending: trustedPublicationAttempted, publicationDeferred: trustedPublicationAttempted } });

    // Canonical Git export is drained asynchronously by the durable receipt queue.
    // Do not perform remote GitHub work in the learner publication request.
    const githubPublication = null;
    const githubPublicationError = null;
    const githubPublicationPending = trustedPublicationAttempted;
    await recordUploadOperation({ batchId, uploadId: upload.uploadId, phase: "VERIFY", status: "SUCCEEDED", storagePath: upload.storagePath, fileName: upload.originalFilename, fileSize: upload.sizeBytes, metadata: { mode: "single-package-request", reviewBatchId: batch.id, trustedLocalization, trustedCanonicalPublication, githubPublication, githubPublicationPending, canonicalPublicationStatus: githubPublicationPending ? "GITHUB_EXPORT_PENDING" : "NOT_REQUIRED" } });
    return Response.json({ success: true, batch, batches: [batch], trustedLocalization, trustedCanonicalPublication, githubPublication, githubPublicationError, githubPublicationPending, canonicalPublicationStatus: githubPublication ? "PR_OPEN_PENDING_MERGE_DEPLOY" : githubPublicationPending ? "GITHUB_EXPORT_PENDING" : "NOT_REQUIRED", publicationDeferred: trustedPublicationAttempted, finalizedCount: 1, skippedCount: trustedLocalization.skippedExisting, failures: [] }, { status: 201, headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch (error) {
    const err = error as Error;
    try { if (upload?.uploadId) await markFailed(upload.uploadId, err.message, true); } catch (receiptError) { console.error("[finalize] unable to persist failure receipt", receiptError); }
    try { await recordUploadOperation({ batchId, uploadId: upload?.uploadId, phase: "FINALIZE", status: "FAILED", storagePath: upload?.storagePath, fileName: upload?.originalFilename, fileSize: upload?.sizeBytes, errorCode: err.name, errorMessage: err.message, metadata: { mode: "single-package-request" } }); } catch (auditError) { console.error("[finalize] unable to persist failure audit", auditError); }
    const busy = error instanceof PublicationBusyError;
    const status = busy ? 423 : 503;
    const responseBody: Record<string, unknown> = { success: false, error: err.message || "Finalize failed.", reason: err.name || "UnknownError", status, batchId, uploadId: upload?.uploadId ?? null, uploadReachedStorage: Boolean(batchId), retryable: true };
    if (process.env.NODE_ENV !== "production") responseBody.stack = err.stack;
    return Response.json(responseBody, { status, headers: { "Cache-Control": "private, no-store, max-age=0" } });
  }
}
