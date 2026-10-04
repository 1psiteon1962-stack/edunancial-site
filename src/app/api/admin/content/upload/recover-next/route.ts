import { NextRequest } from "next/server";
import { authorizeGithubActionsRun } from "@/lib/admin-content/github-actions-runner-auth";
import { beginFinalization, markFailed, markPublished } from "@/lib/admin-content/upload-receipts";
import { PublicationBusyError, withPublicationLease } from "@/lib/admin-content/publication-lock";

import { normalizeMixedLocaleBatch } from "@/lib/admin-content/batch-locale-normalization";
import { inferCurriculumPackageIdentity } from "@/lib/admin-content/package-upload-config";
import { exportBatchToGithub } from "@/lib/admin-content/service";
import { getRecoverableCurriculumPackages } from "@/lib/admin-content/recovery-discovery";
import { recoveryPublicationEnabled } from "@/lib/admin-content/recovery-publication-gate";
import { selectExistingRestorationCandidates } from "@/lib/admin-content/restoration-execution";
import { decideRestorationExecution } from "@/lib/admin-content/restoration-execution-gate";
import { verifyRestoredCanonicalCoordinate } from "@/lib/admin-content/restoration-post-publication";
import { createIndependentUploadBatchFromStoredFiles } from "@/lib/admin-content/stored-upload-finalizer";
import { autoPublishTrustedCanonicalCurriculumBatch } from "@/lib/admin-content/trusted-canonical-ingest";
import { autoPublishTrustedLocalizedLevel1Batch } from "@/lib/admin-content/trusted-localized-ingest";
import { recordUploadOperation } from "@/lib/admin-content/upload-operations";
import { createId } from "@/lib/admin-content/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function canonicalFirst(a: ReturnType<typeof selectExistingRestorationCandidates>[number], b: ReturnType<typeof selectExistingRestorationCandidates>[number]) {
  const aLanguage = a.package.identity?.language;
  const bLanguage = b.package.identity?.language;
  const aCanonical = aLanguage === "en" || aLanguage === "en-US";
  const bCanonical = bLanguage === "en" || bLanguage === "en-US";
  if (aCanonical !== bCanonical) return aCanonical ? -1 : 1;
  return (a.package.reconciliationKey ?? "").localeCompare(b.package.reconciliationKey ?? "");
}

export async function POST(request: NextRequest) {
  if (!(await authorizeGithubActionsRun(request, ["push", "workflow_dispatch"]))) {
    return Response.json({ success: false, error: "Unauthorized recovery runner." }, { status: 401 });
  }
  if (!recoveryPublicationEnabled()) {
    return Response.json(
      { success: false, error: "Interrupted-upload recovery is disabled.", recoveryFrozen: true },
      { status: 423, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const actor = { email: "github-actions-recovery@edunancial.internal" };
  const recoverablePackages = await getRecoverableCurriculumPackages();
  const candidates = selectExistingRestorationCandidates(recoverablePackages)
    .filter((entry) => entry.eligible)
    .sort(canonicalFirst);

  if (candidates.length === 0) {
    return Response.json(
      {
        success: true,
        done: true,
        processed: 0,
        remainingEligible: 0,
        unclassified: recoverablePackages
          .filter((entry) => !entry.identity)
          .map((entry) => ({
            batchId: entry.batchId,
            uploadId: entry.upload.uploadId,
            file: entry.upload.originalFilename,
            reason: entry.classificationError,
          })),
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const blocked: Array<Record<string, unknown>> = [];
  for (const entry of candidates) {
    const classified = entry.package;
    const sameCoordinate = recoverablePackages.filter(
      (candidate) => candidate.reconciliationKey === classified.reconciliationKey,
    );
    if (sameCoordinate.length !== 1) {
      blocked.push({
        batchId: classified.batchId,
        uploadId: classified.upload.uploadId,
        file: classified.upload.originalFilename,
        reconciliationKey: classified.reconciliationKey,
        reason: "duplicate-coordinate",
        candidateCount: sameCoordinate.length,
      });
      continue;
    }

    const executionDecision = await decideRestorationExecution(recoverablePackages, classified);
    if (!executionDecision.allowed) {
      blocked.push({
        batchId: classified.batchId,
        uploadId: classified.upload.uploadId,
        file: classified.upload.originalFilename,
        reconciliationKey: classified.reconciliationKey,
        reason: "execution-gate",
        executionDecision,
      });
      continue;
    }

    const upload = classified.upload;
    const identity = inferCurriculumPackageIdentity(upload.originalFilename, "en-US");
    const recoveryBatchId = createId("batch");
    await beginFinalization({ uploadId: upload.uploadId, originalBatchId: classified.batchId, storagePath: upload.storagePath, originalFilename: upload.originalFilename, coordinate: classified.reconciliationKey }, recoveryBatchId, "recovery");
    const createdBatch = await createIndependentUploadBatchFromStoredFiles(request, actor, {
      batchId: recoveryBatchId,
      batchName: `Recovered ${upload.originalFilename}`,
      source: `Recovered from stored upload batch ${classified.batchId}`,
      notes: "Automated one-time package-scoped recovery from persistent upload storage. No file was re-uploaded.",
      uploadConfig: {
        destination: "courses",
        track: identity.track,
        level: identity.level,
        language: identity.language,
        membershipAccess: "basic",
        publicationStatus: "draft",
        title: identity.title,
        description: "Recovered curriculum ZIP package.",
      },
      uploads: [upload],
    });

    const batch = await normalizeMixedLocaleBatch(createdBatch);
    if (batch.uploads.length === 0 || batch.files.length === 0) {
      return Response.json(
        {
          success: false,
          error: "Stored object could not be processed.",
          failedUploadId: upload.uploadId,
          siblingPackagesUnaffected: true,
        },
        { status: 409 },
      );
    }

    let trustedLocalization;
    let trustedCanonicalPublication;
    try {
      ({ trustedLocalization, trustedCanonicalPublication } = await withPublicationLease(`recovery:${upload.uploadId}`, async () => {
        const trustedLocalization = await autoPublishTrustedLocalizedLevel1Batch(batch, identity, { requireAtomic: true });
        const trustedCanonicalPublication = await autoPublishTrustedCanonicalCurriculumBatch(batch, identity, actor, { requireAtomic: true });
        return { trustedLocalization, trustedCanonicalPublication };
      }));
    } catch (error) {
      await markFailed(upload.uploadId, error instanceof Error ? error.message : String(error), true);
      if (error instanceof PublicationBusyError) return Response.json({ success:false,error:error.message,retryAfterMs:error.retryAfterMs },{status:423,headers:{"Cache-Control":"private, no-store"}});
      throw error;
    }
    const postPublicationVerification = identity.language === "en" || identity.language === "en-US"
      ? await verifyRestoredCanonicalCoordinate(classified.reconciliationKey!)
      : null;
    const trustedPublicationAttempted = trustedLocalization.attempted || trustedCanonicalPublication.attempted;
    const githubPublication = null;

    if (postPublicationVerification && !postPublicationVerification.complete) {
      return Response.json(
        {
          success: false,
          error: "Canonical restoration published but did not resolve all 50 learner lessons.",
          postPublicationVerification,
          failedUploadId: upload.uploadId,
          siblingPackagesUnaffected: true,
        },
        { status: 409, headers: { "Cache-Control": "private, no-store" } },
      );
    }

    await markPublished(upload.uploadId, { reviewBatchId: recoveryBatchId, verification: { learnerVisible: postPublicationVerification?.complete !== false, detail: postPublicationVerification ? "Canonical learner verification completed." : "Localized trusted publication completed." }, githubExportRequired: trustedPublicationAttempted, recoveredWithoutReupload: true });
    await recordUploadOperation({
      batchId: classified.batchId,
      uploadId: upload.uploadId,
      phase: "VERIFY",
      status: "SUCCEEDED",
      storagePath: upload.storagePath,
      fileName: upload.originalFilename,
      fileSize: upload.sizeBytes,
      metadata: {
        recoveryBatchId,
        recoveredWithoutReupload: true,
        trustedLocalization,
        trustedCanonicalPublication,
        githubPublication,
        postPublicationVerification,
        publicationDeferred: false,
        runner: "github-actions-package-recovery",
        discoverySource: "persistent-storage",
      },
    });

    return Response.json(
      {
        success: true,
        done: false,
        processed: 1,
        remainingEligible: candidates.length - 1,
        originalBatchId: classified.batchId,
        recoveryBatchId,
        recoveredUploadId: upload.uploadId,
        file: upload.originalFilename,
        reconciliationKey: classified.reconciliationKey,
        trustedLocalization,
        trustedCanonicalPublication,
        githubPublication,
        postPublicationVerification,
      },
      { status: 200, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  return Response.json(
    {
      success: false,
      done: false,
      processed: 0,
      remainingEligible: candidates.length,
      error: "No eligible stored package passed the current restoration execution gate.",
      blocked,
    },
    { status: 409, headers: { "Cache-Control": "private, no-store" } },
  );
}
