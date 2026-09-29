import { inferCurriculumPackageIdentity } from "@/lib/admin-content/package-upload-config";
import type { StoredUploadEntry } from "@/lib/admin-content/service";
import { getAdminContentStorage } from "@/lib/admin-content/storage";

export type RecoveryCandidate = { batchId: string; upload: StoredUploadEntry };

export type RecoverableCurriculumPackage = RecoveryCandidate & {
  identity:
    | ReturnType<typeof inferCurriculumPackageIdentity>
    | null;
  classificationError: string | null;
  reconciliationKey: string | null;
};

/**
 * Read-only discovery of stored curriculum ZIPs that have not been claimed by
 * a completed extracted batch. This function never creates a batch, publishes
 * curriculum, or mutates persistent upload storage.
 */
export async function getRecoverableUploads(): Promise<RecoveryCandidate[]> {
  const storage = getAdminContentStorage();
  const [entries, summaries] = await Promise.all([
    storage.listWorkspaceEntries(),
    storage.listBatches(),
  ]);
  const batches = await Promise.all(
    summaries.map((summary) => storage.getBatch(summary.id)),
  );

  const finalized = new Set(
    batches.flatMap((batch) => {
      if (!batch || batch.files.length === 0) return [];
      return batch.uploads
        .filter((upload) =>
          batch.files.some(
            (file) =>
              file.uploadId === upload.id ||
              file.archivePath?.startsWith(upload.originalFilename + "/") ||
              (batch.uploads.length === 1 && batch.files.length > 0),
          ),
        )
        .map((upload) => upload.storagePath);
    }),
  );

  const candidates: RecoveryCandidate[] = [];
  const seen = new Set<string>();
  for (const storagePath of entries) {
    if (
      !storagePath.startsWith("uploads/courses/") ||
      !storagePath.toLowerCase().endsWith(".zip")
    ) continue;
    if (finalized.has(storagePath) || seen.has(storagePath)) continue;

    const match = storagePath.match(
      /^uploads\/courses\/(batch_[^/]+)\/(upload_[0-9a-f-]+)-(.+\.zip)$/iu,
    );
    if (!match) continue;

    const [, batchId, uploadId, originalFilename] = match;
    seen.add(storagePath);
    candidates.push({
      batchId,
      upload: {
        uploadId,
        originalFilename,
        mimeType: "application/zip",
        sizeBytes: 0,
        storagePath,
      },
    });
  }
  return candidates;
}

function toReconciliationKey(identity: ReturnType<typeof inferCurriculumPackageIdentity>) {
  return `${identity.track.toUpperCase()}:L${identity.level.replace("level-", "")}:${identity.language}`;
}

export async function getRecoverableCurriculumPackages(): Promise<RecoverableCurriculumPackage[]> {
  const candidates = await getRecoverableUploads();
  return candidates.map((candidate) => {
    try {
      return {
        ...candidate,
        identity: inferCurriculumPackageIdentity(candidate.upload.originalFilename, "en-US"),
        classificationError: null,
        reconciliationKey: toReconciliationKey(inferCurriculumPackageIdentity(candidate.upload.originalFilename, "en-US")),
      };
    } catch (error) {
      return {
        ...candidate,
        identity: null,
        classificationError: error instanceof Error ? error.message : String(error),
        reconciliationKey: null,
      };
    }
  });
}
