import { normalizeMixedLocaleBatch } from "@/lib/admin-content/batch-locale-normalization";
import { inferCurriculumPackageIdentity } from "@/lib/admin-content/package-upload-config";
import { getRecoverableCurriculumPackages, getRecoverableUploads } from "@/lib/admin-content/recovery-discovery";
import { selectExistingRestorationCandidates } from "@/lib/admin-content/restoration-execution";
import { decideRestorationExecution } from "@/lib/admin-content/restoration-execution-gate";
import { verifyRestoredCanonicalCoordinate } from "@/lib/admin-content/restoration-post-publication";
import { createIndependentUploadBatchFromStoredFiles } from "@/lib/admin-content/stored-upload-finalizer";
import { autoPublishTrustedCanonicalCurriculumBatch } from "@/lib/admin-content/trusted-canonical-ingest";
import { autoPublishTrustedLocalizedLevel1Batch } from "@/lib/admin-content/trusted-localized-ingest";
import { recordUploadOperation } from "@/lib/admin-content/upload-operations";
import { createId } from "@/lib/admin-content/utils";
import { beginFinalization, getUploadReceipt, markFailed, markPublished } from "@/lib/admin-content/upload-receipts";
import { withPublicationLease } from "@/lib/admin-content/publication-lock";
import { verifyLearnerVisibility } from "@/lib/admin-content/learner-readback";
import type { ActorContext } from "@/lib/admin-content/types";

export async function recoverStoredCurriculumPackage(input: { batchId: string; uploadId: string; actor: ActorContext; onPhase?: (phase: string) => Promise<void> | void }) {
  const { batchId, uploadId, actor } = input;
  const phase = async (name: string) => { try { await input.onPhase?.(name); } catch (error) { console.warn(`[recovery-worker] phase report ${name} failed`, error); } };
  await phase("LOCATING_STORED_PACKAGE");
  const existingReceipt = await getUploadReceipt(uploadId);
  if (existingReceipt?.state === "PUBLISHED" && existingReceipt.verification?.learnerVisible === true && existingReceipt.reviewBatchId) {
    return { reviewBatchId: existingReceipt.reviewBatchId, alreadyRecovered: true };
  }

  const [candidates, classifiedPackages] = await Promise.all([
    getRecoverableUploads(),
    getRecoverableCurriculumPackages(),
  ]);
  const candidate = candidates.find((entry) => entry.batchId === batchId && entry.upload.uploadId === uploadId);
  const classified = classifiedPackages.find((entry) => entry.batchId === batchId && entry.upload.uploadId === uploadId);
  if (!candidate || !classified) throw new Error("Stored upload is unavailable, already finalized, or already recovered.");

  await phase("CHECKING_PREREQUISITES");
  const executionCandidate = selectExistingRestorationCandidates([classified])[0];
  if (!executionCandidate?.eligible) throw new Error(`Stored package is outside the supported L1-L5 recovery scope: ${executionCandidate?.reason ?? "unclassified"}`);
  const executionDecision = await decideRestorationExecution([classified], classified);
  if (!executionDecision.allowed) throw new Error(`Restoration prerequisite is not learner-resolvable: ${executionDecision.reason ?? "blocked"}`);

  const upload = candidate.upload;
  const identity = inferCurriculumPackageIdentity(upload.originalFilename, "en-US");
  const recoveryBatchId = createId("batch");
  await beginFinalization({ uploadId, originalBatchId: batchId, storagePath: upload.storagePath, originalFilename: upload.originalFilename, coordinate: classified.reconciliationKey }, recoveryBatchId, "recovery");

  try {
    await phase("EXTRACTING_AND_VALIDATING");
    const syntheticRequest = new Request("https://edunancial.internal/background-recovery", { headers: { "x-forwarded-for": "background-worker" } });
    const createdBatch = await createIndependentUploadBatchFromStoredFiles(syntheticRequest, actor, {
      batchId: recoveryBatchId,
      batchName: `Recovered ${upload.originalFilename}`,
      source: `Recovered from stored upload batch ${batchId}`,
      notes: "Recovered by durable background worker. No file was re-uploaded.",
      uploadConfig: { destination: "courses", track: identity.track, level: identity.level, language: identity.language, membershipAccess: "basic", publicationStatus: "draft", title: identity.title, description: "Recovered curriculum ZIP package." },
      uploads: [upload],
    });
    const batch = await normalizeMixedLocaleBatch(createdBatch);
    if (!batch.uploads.length || !batch.files.length) throw new Error("The stored object could not be processed. It may not have completed transfer.");

    await phase("ACQUIRING_PUBLICATION_LEASE");
    const { trustedLocalization, trustedCanonicalPublication } = await withPublicationLease(`background-recovery:${uploadId}`, async (lease) => {
      await phase("TRANSACTIONAL_PUBLICATION");
      const trustedLocalization = await autoPublishTrustedLocalizedLevel1Batch(batch, identity, { requireAtomic: true });
      const trustedCanonicalPublication = await autoPublishTrustedCanonicalCurriculumBatch(batch, identity, actor, { requireAtomic: true, uploadId, lease });
      await phase("LEARNER_READBACK");
      const verification = await verifyLearnerVisibility(batch, identity);
      if (!verification.learnerVisible) throw new Error(`Learner verification failed: ${verification.detail}`);
      await markPublished(uploadId, {
        reviewBatchId: recoveryBatchId,
        verification,
        githubExportRequired: trustedLocalization.attempted || trustedCanonicalPublication.attempted,
        recoveredWithoutReupload: true,
      });
      return { trustedLocalization, trustedCanonicalPublication };
    });

    await phase("POST_PUBLICATION_COORDINATE_CHECK");
    const postPublicationVerification = identity.language === "en" || identity.language === "en-US"
      ? await verifyRestoredCanonicalCoordinate(classified.reconciliationKey!)
      : null;
    if (postPublicationVerification && !postPublicationVerification.complete) {
      throw new Error("Canonical restoration published but did not resolve all 50 learner lessons.");
    }
    const trustedPublicationAttempted = trustedLocalization.attempted || trustedCanonicalPublication.attempted;
    await recordUploadOperation({
      batchId, uploadId, phase: "VERIFY", status: "SUCCEEDED", storagePath: upload.storagePath,
      fileName: upload.originalFilename, fileSize: upload.sizeBytes,
      metadata: { recoveryBatchId, recoveredWithoutReupload: true, trustedLocalization, trustedCanonicalPublication, githubPublication: null, githubPublicationPending: trustedPublicationAttempted, postPublicationVerification, publicationDeferred: false, discoverySource: "background-worker" },
    });
    return { reviewBatchId: recoveryBatchId, alreadyRecovered: false };
  } catch (error) {
    await markFailed(uploadId, error instanceof Error ? error.message : String(error), true);
    throw error;
  }
}
