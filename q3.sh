set -euo pipefail
git fetch origin
git checkout test/q3-finalize-validation-regression-20261018
git pull --ff-only origin test/q3-finalize-validation-regression-20261018
test "$(git rev-parse HEAD)" = "bf9671aaa5e6cefa9d822198c8e17219049d169b" || { echo "STOP: PR #1305 head moved; report this."; exit 1; }

cat > src/app/api/admin/content/upload/finalize/route.ts <<'EDU_EOF'
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
import { beginFinalization, FinalizationInProgressError, getUploadReceipt, markFailed, markPublished, markStoredForReview } from "@/lib/admin-content/upload-receipts";
import { PublicationBusyError, withPublicationLease } from "@/lib/admin-content/publication-lock";
import { recordCurriculumUpload, transitionCurriculumUpload } from "@/lib/admin-content/neon-upload-state";
import { queueNeonGitExport } from "@/lib/curriculum/neon-published-store";
import { enqueueExportWithoutInvalidatingPublication } from "@/lib/admin-content/secondary-git-export";
import { verifyLearnerVisibility } from "@/lib/admin-content/learner-readback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const NO_STORE = { "Cache-Control": "private, no-store, max-age=0" } as const;

type FinalizeBody = { batchId: string; batchName?: string; source?: string; notes?: string; uploads: StoredUploadEntry[]; [key: string]: unknown };

function isStoredUploadEntry(value: Partial<StoredUploadEntry> | null | undefined): value is StoredUploadEntry {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
    && typeof value!.uploadId === "string" && value!.uploadId.trim().length > 0
    && typeof value!.storagePath === "string" && value!.storagePath.trim().length > 0
    && typeof value!.originalFilename === "string" && value!.originalFilename.trim().length > 0;
}

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
    // Q3 contract: every malformed request below is a deterministic client
    // error. Return 400 with retryable:false BEFORE any receipt, audit, or
    // storage side effect, so clients never retry and no upload is marked failed.
    let body: FinalizeBody;
    try { body = (await request.json()) as FinalizeBody; } catch { return Response.json({ success: false, error: "Request body must be valid JSON.", reason: "InvalidRequest", retryable: false }, { status: 400, headers: NO_STORE }); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return Response.json({ success: false, error: "Request body must be a JSON object.", reason: "InvalidRequest", retryable: false }, { status: 400, headers: NO_STORE });
    batchId = typeof body.batchId === "string" ? body.batchId.trim() : "";
    if (!batchId) return Response.json({ success: false, error: "batchId is required.", reason: "InvalidRequest", retryable: false }, { status: 400, headers: NO_STORE });
    if (!Array.isArray(body.uploads) || body.uploads.length !== 1) return Response.json({ success: false, error: "Finalize accepts exactly one stored package per request.", reason: "InvalidRequest", retryable: false, batchId }, { status: 400, headers: NO_STORE });
    const candidate = body.uploads[0] as Partial<StoredUploadEntry> | null;
    if (!isStoredUploadEntry(candidate)) return Response.json({ success: false, error: "uploads[0] must include uploadId, storagePath, and originalFilename.", reason: "InvalidRequest", retryable: false, batchId }, { status: 400, headers: NO_STORE });
    const currentUpload: StoredUploadEntry = candidate;

    const configFormData = new FormData();
    for (const [key, value] of Object.entries(body)) if (!["batchId", "batchName", "source", "notes", "uploads"].includes(key) && (typeof value === "string" || typeof value === "number")) configFormData.append(key, String(value));
    let uploadConfig: ReturnType<typeof parseUploadConfig>;
    try { uploadConfig = parseUploadConfig(configFormData); } catch (configError) { return Response.json({ success: false, error: configError instanceof Error ? configError.message : "Invalid upload configuration.", reason: "InvalidRequest", retryable: false, batchId, uploadId: currentUpload.uploadId }, { status: 400, headers: NO_STORE }); }
    // Only assign after validation so the catch block never marks a receipt
    // failed for a request that was rejected as malformed.
    upload = currentUpload;
    const packageIdentity = uploadConfig.destination === "courses" ? inferCurriculumPackageIdentity(currentUpload.originalFilename, uploadConfig.language) : null;
    const trustedLocalized = isTrustedLocalizedLevel1Identity(packageIdentity);
    const trustedCanonical = isTrustedCanonicalCurriculumIdentity(packageIdentity);

    // Finalization is idempotent for every stored package, including trusted
    // curriculum. Retrying a successful trusted upload must not create a second
    // review batch, atomic publication, or Git publication PR.
    const existingReceipt = await getUploadReceipt(currentUpload.uploadId);
    if (existingReceipt?.state === "PUBLISHED" && existingReceipt.reviewBatchId) {
      return Response.json({ success: true, alreadyFinalized: true, uploadId: currentUpload.uploadId, batch: { id: existingReceipt.reviewBatchId }, batches: [{ id: existingReceipt.reviewBatchId }], finalizedCount: 0, skippedCount: 1, receipt: existingReceipt }, { status: 200, headers: { "Cache-Control": "private, no-store, max-age=0" } });
    }
    const existingReviewBatchId = await getAlreadyFinalizedReviewBatchId(batchId, currentUpload.uploadId);
    if (existingReviewBatchId) {
      return Response.json({ success: true, alreadyFinalized: true, uploadId: currentUpload.uploadId, batch: { id: existingReviewBatchId }, batches: [{ id: existingReviewBatchId }], finalizedCount: 0, skippedCount: 1 }, { status: 200, headers: { "Cache-Control": "private, no-store, max-age=0" } });
    }

    const reviewBatchId = createId("batch");
    await beginFinalization({ uploadId: currentUpload.uploadId, originalBatchId: batchId, storagePath: currentUpload.storagePath, originalFilename: currentUpload.originalFilename, coordinate: packageIdentity ? `${packageIdentity.track}:${packageIdentity.level}:${packageIdentity.language}` : null }, reviewBatchId, "finalize");
    if (process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL) {
      await recordCurriculumUpload({ uploadId: currentUpload.uploadId, batchId, storagePath: currentUpload.storagePath, filename: currentUpload.originalFilename, coordinate: packageIdentity ? `${packageIdentity.track}:${packageIdentity.level}:${packageIdentity.language}` : undefined });
      await transitionCurriculumUpload(currentUpload.uploadId, "VALIDATING", { reviewBatchId });
    }
    await recordUploadOperation({ batchId, uploadId: currentUpload.uploadId, phase: "FINALIZE", status: "STARTED", storagePath: currentUpload.storagePath, fileName: currentUpload.originalFilename, fileSize: currentUpload.sizeBytes, metadata: { mode: "single-package-request", reviewBatchId, packageIdentity } });

    const createdBatch = await createIndependentUploadBatchFromStoredFiles(request, actor, { batchId: reviewBatchId, batchName: `${String(body.batchName ?? "Content upload")} — ${currentUpload.originalFilename}`, source: String(body.source ?? ""), notes: String(body.notes ?? ""), uploadConfig, uploads: [currentUpload] });
    const batch = await normalizeMixedLocaleBatch(createdBatch);
    if (batch.uploads.length === 0 || batch.files.length === 0) {
      const detail = batch.warnings.length ? batch.warnings.join(" | ") : "No reviewable files were produced from the uploaded object.";
      throw new Error(`Uploaded file reached GitHub storage but could not be processed: ${detail}`);
    }

    if (process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL) {
      await transitionCurriculumUpload(currentUpload.uploadId, "READY", { reviewBatchId: batch.id });
    }
    const { trustedLocalization, trustedCanonicalPublication } = await withPublicationLease(`finalize:${currentUpload.uploadId}`, async (lease) => {
      if (process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL) {
        await transitionCurriculumUpload(currentUpload.uploadId, "PUBLISHING", { reviewBatchId: batch.id });
      }
      const trustedLocalization = await autoPublishTrustedLocalizedLevel1Batch(batch, packageIdentity, { requireAtomic: true });
      const trustedCanonicalPublication = await autoPublishTrustedCanonicalCurriculumBatch(batch, packageIdentity, actor, { requireAtomic: true, uploadId: currentUpload.uploadId, lease });
      const trustedPublicationAttempted = trustedLocalization.attempted || trustedCanonicalPublication.attempted;
      if (trustedPublicationAttempted && packageIdentity) {
        const verification = await verifyLearnerVisibility(batch, packageIdentity);
        if (!verification.learnerVisible) throw new Error(`Learner verification failed: ${verification.detail}`);
        await markPublished(currentUpload.uploadId, { reviewBatchId: batch.id, verification, githubExportRequired: true, recoveredWithoutReupload: false });
        if (process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL) {
          try {
            await transitionCurriculumUpload(currentUpload.uploadId, "PUBLISHED", { reviewBatchId: batch.id, verification });
          } catch (stateError) { console.error("[finalize] durable publish state transition failed", stateError); throw stateError; }
          // Git export is secondary to verified learner publication. A queue outage
          // must not mark an already PUBLISHED receipt as a failed upload.
          await enqueueExportWithoutInvalidatingPublication(
            () => queueNeonGitExport(currentUpload.uploadId),
            (queueError) => console.error("[finalize] Git export queue deferred for published upload", queueError),
          );
        }
      } else {
        if (uploadConfig.destination === "courses") { const detail = "Curriculum coordinate could not be inferred from package; not published."; await markFailed(currentUpload.uploadId, detail, true); }
      }
      return { trustedLocalization, trustedCanonicalPublication };
    });
    const trustedPublicationAttempted = trustedLocalization.attempted || trustedCanonicalPublication.attempted;

    // Atomic learner publication is the durable finalization boundary. GitHub
    // export is a second remote operation and must never turn a successfully
    // stored, validated, and atomically published package back into a failed
    // upload. Persist FINALIZE success first so a slow/failed GitHub request
    // cannot strand the stored ZIP or cause a duplicate recovery attempt.
    await recordUploadOperation({ batchId, uploadId: currentUpload.uploadId, phase: "FINALIZE", status: "SUCCEEDED", storagePath: currentUpload.storagePath, fileName: currentUpload.originalFilename, fileSize: currentUpload.sizeBytes, metadata: { mode: "single-package-request", reviewBatchId: batch.id, packageIdentity, trustedPublicationAttempted } });

    // Canonical Git export is drained asynchronously by the durable receipt queue.
    // Do not perform remote GitHub work in the learner publication request.
    const githubPublication = null;
    const githubPublicationError = null;
    const githubPublicationPending = trustedPublicationAttempted;
    await recordUploadOperation({ batchId, uploadId: currentUpload.uploadId, phase: "VERIFY", status: "SUCCEEDED", storagePath: currentUpload.storagePath, fileName: currentUpload.originalFilename, fileSize: currentUpload.sizeBytes, metadata: { reviewBatchId: batch.id, verification: await verifyLearnerVisibility(batch, packageIdentity) } });
    const receipt = await getUploadReceipt(currentUpload.uploadId);
    return Response.json({ success: true, batch, batches: [batch], receipt, trustedLocalization, trustedCanonicalPublication, githubPublication, githubPublicationError, githubPublicationPending, reviewBatchId: batch.id }, { status: 200, headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch (error) {
    const err = error as Error;
    if (error instanceof FinalizationInProgressError) {
      // Another request owns this upload right now. Do NOT mark it failed and do
      // NOT start a second publication; the caller reconciles via GET status.
      return Response.json(
        { success: false, error: err.message, reason: err.name, status: 409, inProgress: true, batchId, uploadId: upload?.uploadId ?? null, uploadReachedStorage: true, retryable: false, retryAfterSeconds: Math.ceil(error.retryAfterMs / 1000) },
        { status: 409, headers: { "Cache-Control": "private, no-store, max-age=0", "Retry-After": String(Math.ceil(error.retryAfterMs / 1000)) } },
      );
    }
    try { if (upload?.uploadId) await markFailed(upload.uploadId, err.message, true); } catch (receiptError) { console.error("[finalize] unable to persist failure receipt", receiptError); }
    try { await recordUploadOperation({ batchId, uploadId: upload?.uploadId, phase: "FINALIZE", status: "FAILED", storagePath: upload?.storagePath, fileName: upload?.originalFilename, fileSize: upload?.sizeBytes, metadata: { reviewBatchId: null, error: err.message } }); } catch (auditError) { console.error("[finalize] unable to record finalization failure audit", auditError); }
    const busy = error instanceof PublicationBusyError;
    const status = busy ? 423 : 503;
    const responseBody: Record<string, unknown> = { success: false, error: err.message || "Finalize failed.", reason: err.name || "UnknownError", status, batchId, uploadId: upload?.uploadId ?? null, uploadReachedStorage: !!upload, retryable: !busy };
    if (process.env.NODE_ENV !== "production") responseBody.stack = err.stack;
    return Response.json(responseBody, { status, headers: { "Cache-Control": "private, no-store, max-age=0" } });
  }
}
EDU_EOF

bash -n src/app/api/admin/content/upload/finalize/route.ts
