import { NextRequest } from "next/server";

import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { normalizeMixedLocaleBatch } from "@/lib/admin-content/batch-locale-normalization";
import { inferCurriculumPackageIdentity } from "@/lib/admin-content/package-upload-config";
import { getRecoverableCurriculumPackages, getRecoverableUploads, type RecoveryCandidate } from "@/lib/admin-content/recovery-discovery";
import { recoveryPublicationEnabled } from "@/lib/admin-content/recovery-publication-gate";
import { selectExistingRestorationCandidates } from "@/lib/admin-content/restoration-execution";
import { decideRestorationExecution } from "@/lib/admin-content/restoration-execution-gate";
import { decideControlledRestorationStep } from "@/lib/admin-content/restoration-controlled-execution";
import { createIndependentUploadBatchFromStoredFiles } from "@/lib/admin-content/stored-upload-finalizer";
import { autoPublishTrustedCanonicalCurriculumBatch } from "@/lib/admin-content/trusted-canonical-ingest";
import { autoPublishTrustedLocalizedLevel1Batch } from "@/lib/admin-content/trusted-localized-ingest";
import { recordUploadOperation } from "@/lib/admin-content/upload-operations";
import { createId } from "@/lib/admin-content/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Fail closed. Production restoration requires an explicit deployment-time switch.
// The switch is global across tracks/levels/locales; package identity and the
// shared validator enforce the configured curriculum coordinate.
const RECOVERY_PUBLICATION_ENABLED = recoveryPublicationEnabled();

export async function GET(request: NextRequest) {
  const auth = await requireAdminApiSession(request, false);
  if (!auth.ok) return auth.response;
  try {
    const candidates = await getRecoverableCurriculumPackages();
    const grouped = new Map<string, typeof candidates>();
    for (const candidate of candidates) grouped.set(candidate.batchId, [...(grouped.get(candidate.batchId) ?? []), candidate]);
    return Response.json({
      success: true,
      recoverable: Array.from(grouped, ([batchId, packages]) => ({
        batchId,
        uploads: packages.map(({ upload }) => upload),
        packages: packages.map(({ upload, identity, classificationError, reconciliationKey }) => ({
          uploadId: upload.uploadId,
          originalFilename: upload.originalFilename,
          storagePath: upload.storagePath,
          identity,
          classificationError,
          reconciliationKey,
        })),
      })),
      recoveryAvailable: RECOVERY_PUBLICATION_ENABLED,
      recoveryFrozen: !RECOVERY_PUBLICATION_ENABLED,
      discoverySource: "persistent-storage",
      readOnlyInventory: true,
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return Response.json({ success: true, recoverable: [], recoveryAvailable: false, warning: "Interrupted-upload recovery could not inspect persistent upload storage.", error: error instanceof Error ? error.message : String(error) }, { headers: { "Cache-Control": "private, no-store" } });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  if (!RECOVERY_PUBLICATION_ENABLED) return Response.json({ success: false, error: "Interrupted-upload recovery is disabled during curriculum consolidation.", recoveryFrozen: true }, { status: 423, headers: { "Cache-Control": "private, no-store" } });
  const actor = toActor(auth.session);
  const body = await request.json() as { batchId?: string; uploadId?: string; completedSequences?: number[] };
  const batchId = String(body.batchId ?? "").trim();
  const uploadId = String(body.uploadId ?? "").trim();
  const completedSequences = new Set((body.completedSequences ?? []).filter((value): value is number => Number.isInteger(value) && value > 0));
  if (!batchId || !uploadId) return Response.json({ success: false, error: "batchId and uploadId are required." }, { status: 400 });
  let candidates: RecoveryCandidate[];
  try { candidates = await getRecoverableUploads(); } catch (error) { return Response.json({ success: false, error: "Persistent upload storage could not be inspected.", detail: error instanceof Error ? error.message : String(error), failedUploadId: uploadId, siblingPackagesUnaffected: true }, { status: 503 }); }
  const candidate = candidates.find((entry) => entry.batchId === batchId && entry.upload.uploadId === uploadId);
  if (!candidate) return Response.json({ success: false, error: "Stored upload is unavailable, already finalized, or already recovered.", failedUploadId: uploadId, siblingPackagesUnaffected: true }, { status: 404 });
  const classified = (await getRecoverableCurriculumPackages()).find((entry) => entry.batchId === batchId && entry.upload.uploadId === uploadId);
  const executionCandidate = classified ? selectExistingRestorationCandidates([classified])[0] : null;
  if (!executionCandidate?.eligible) return Response.json({ success: false, error: "Stored package is outside the current existing L1-L3 restoration scope.", reason: executionCandidate?.reason ?? "unclassified", failedUploadId: uploadId, siblingPackagesUnaffected: true }, { status: 409, headers: { "Cache-Control": "private, no-store" } });
  const recoverablePackages = await getRecoverableCurriculumPackages();
  const sameCoordinate = recoverablePackages.filter((entry) => entry.reconciliationKey === classified?.reconciliationKey);
  if (sameCoordinate.length !== 1) return Response.json({ success: false, error: "Restoration requires exactly one recoverable package for this curriculum coordinate.", reconciliationKey: classified?.reconciliationKey, candidateCount: sameCoordinate.length, failedUploadId: uploadId, siblingPackagesUnaffected: true }, { status: 409, headers: { "Cache-Control": "private, no-store" } });
  const executionDecision = await decideRestorationExecution(recoverablePackages, classified!);
  if (!executionDecision.allowed) return Response.json({ success: false, error: "Restoration is blocked until its verified canonical prerequisite is learner-resolvable.", executionDecision, failedUploadId: uploadId, siblingPackagesUnaffected: true }, { status: 409, headers: { "Cache-Control": "private, no-store" } });
  const controlledDecision = await decideControlledRestorationStep(recoverablePackages, classified!, completedSequences);
  if (!controlledDecision.allowed) return Response.json({ success: false, error: "Restoration package is not the next verified execution step.", controlledDecision, failedUploadId: uploadId, siblingPackagesUnaffected: true }, { status: 409, headers: { "Cache-Control": "private, no-store" } });
  const upload = candidate.upload;
  let identity;
  try { identity = inferCurriculumPackageIdentity(upload.originalFilename, "en-US"); } catch (error) { return Response.json({ success: false, error: (error as Error).message, failedUploadId: uploadId, siblingPackagesUnaffected: true }, { status: 400 }); }
  const recoveryBatchId = createId("batch");
  const createdBatch = await createIndependentUploadBatchFromStoredFiles(request, actor, { batchId: recoveryBatchId, batchName: `Recovered ${upload.originalFilename}`, source: `Recovered from stored upload batch ${batchId}`, notes: "Recovered from persistent upload storage after finalization was interrupted. No file was re-uploaded.", uploadConfig: { destination: "courses", track: identity.track, level: identity.level, language: identity.language, membershipAccess: "basic", publicationStatus: "draft", title: identity.title, description: "Recovered curriculum ZIP package." }, uploads: [upload] });
  // Recovery must use the same mixed-locale normalization gate as normal finalization.
  // This prevents stored packages from being classified or published differently
  // simply because they entered through the interrupted-upload recovery route.
  const batch = await normalizeMixedLocaleBatch(createdBatch);
  if (batch.uploads.length === 0 || batch.files.length === 0) return Response.json({ success: false, error: "The stored object could not be processed. It may not have completed transfer." }, { status: 409 });
  const trustedLocalization = await autoPublishTrustedLocalizedLevel1Batch(batch, identity, { requireAtomic: true });
  const trustedCanonicalPublication = await autoPublishTrustedCanonicalCurriculumBatch(batch, identity, actor, { requireAtomic: true });
  await recordUploadOperation({ batchId, uploadId, phase: "VERIFY", status: "SUCCEEDED", storagePath: upload.storagePath, fileName: upload.originalFilename, fileSize: upload.sizeBytes, metadata: { recoveryBatchId, recoveredWithoutReupload: true, trustedLocalization, trustedCanonicalPublication, publicationDeferred: false, discoverySource: "persistent-storage" } });
  return Response.json({ success: true, originalBatchId: batchId, recoveredUploadId: uploadId, batch, trustedLocalization, trustedCanonicalPublication, publicationDeferred: false }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
}
