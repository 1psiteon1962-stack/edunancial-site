import { NextRequest } from "next/server";

import { normalizeMixedLocaleBatch } from "@/lib/admin-content/batch-locale-normalization";
import { inferCurriculumPackageIdentity } from "@/lib/admin-content/package-upload-config";
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
export const maxDuration = 300;

async function authorizeGithubActions(request: NextRequest) {
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const repository = request.headers.get("x-github-repository") ?? "";
  const runId = request.headers.get("x-github-run-id") ?? "";
  const expected = `${process.env.EDUNANCIAL_GITHUB_OWNER}/${process.env.EDUNANCIAL_GITHUB_REPO}`;
  if (!token || !runId || repository !== expected) return false;

  const response = await fetch(
    `https://api.github.com/repos/${expected}/actions/runs/${encodeURIComponent(runId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    },
  );
  if (!response.ok) return false;

  const run = await response.json() as {
    head_branch?: string;
    event?: string;
    status?: string;
    repository?: { full_name?: string };
  };
  return run.repository?.full_name === expected
    && run.head_branch === "main"
    && run.event === "push"
    && run.status === "in_progress";
}

function canonicalFirst(a: ReturnType<typeof selectExistingRestorationCandidates>[number], b: ReturnType<typeof selectExistingRestorationCandidates>[number]) {
  const aLanguage = a.package.identity?.language;
  const bLanguage = b.package.identity?.language;
  const aCanonical = aLanguage === "en" || aLanguage === "en-US";
  const bCanonical = bLanguage === "en" || bLanguage === "en-US";
  if (aCanonical !== bCanonical) return aCanonical ? -1 : 1;
  return (a.package.reconciliationKey ?? "").localeCompare(b.package.reconciliationKey ?? "");
}

export async function POST(request: NextRequest) {
  if (!(await authorizeGithubActions(request))) {
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

    const trustedLocalization = await autoPublishTrustedLocalizedLevel1Batch(batch, identity, { requireAtomic: true });
    const trustedCanonicalPublication = await autoPublishTrustedCanonicalCurriculumBatch(
      batch,
      identity,
      actor,
      { requireAtomic: true },
    );
    const postPublicationVerification = identity.language === "en" || identity.language === "en-US"
      ? await verifyRestoredCanonicalCoordinate(classified.reconciliationKey!)
      : null;

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
