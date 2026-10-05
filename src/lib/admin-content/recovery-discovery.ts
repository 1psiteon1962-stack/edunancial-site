import ingestLedger from "../../../.edunancial-admin-content/ingest-ledger.json";
import { inferCurriculumPackageIdentity } from "@/lib/admin-content/package-upload-config";
import type { StoredUploadEntry } from "@/lib/admin-content/service";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import { getUploadReceipt, uploadIdFromStoragePath } from "@/lib/admin-content/upload-receipts";
import type { UploadBatch } from "@/lib/admin-content/types";

export type RecoveryCandidate = { batchId: string; upload: StoredUploadEntry };

type StoredZipIngestLedger = {
  packages?: Record<string, { path?: string; status?: string }>;
};

function normalizeStoredUploadPath(path: string) {
  return path.replace(/^\.edunancial-admin-content\//u, "");
}

function getDurablyIngestedStoragePaths() {
  const packages = (ingestLedger as StoredZipIngestLedger).packages ?? {};
  return new Set(
    Object.values(packages).flatMap((entry) => {
      if (
        !entry ||
        typeof entry.path !== "string" ||
        !["ingested", "merged", "live"].includes(String(entry.status ?? "").toLowerCase())
      ) return [];
      return [normalizeStoredUploadPath(entry.path)];
    }),
  );
}

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
  const entries = await storage.listWorkspaceEntries();

  // Legacy FINALIZE audit events are not proof of learner-visible publication.\n  // Before learner read-back was enforced, FINALIZE could be recorded as SUCCEEDED\n  // while the package was only in a review/export state. Recovery therefore uses\n  // the learner-verified PUBLISHED receipt below as the completion authority.\n\n  // The historical stored-ZIP ingestion pipeline writes an exact-path durable
  // receipt to the repository ledger. Those packages are already canonical and
  // must not be offered for recovery even when older runs predate FINALIZE audit
  // receipts. Invalid/failed ledger entries deliberately remain recoverable.
  const ingested = getDurablyIngestedStoragePaths();

  const candidates: RecoveryCandidate[] = [];
  const seen = new Set<string>();
  for (const storagePath of entries) {
    if (
      !storagePath.startsWith("uploads/courses/") ||
      !storagePath.toLowerCase().endsWith(".zip")
    ) continue;
    if (ingested.has(storagePath) || seen.has(storagePath)) continue;
    const receiptUploadId = uploadIdFromStoragePath(storagePath);
    if (receiptUploadId) {
      const receipt = await getUploadReceipt(receiptUploadId);
      if (receipt?.state === "PUBLISHED") continue;
      if (receipt?.state === "FAILED" && receipt.retryable === false) continue;
    }

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
  // Legacy uploader generations could persist the extracted review batch but not
  // retain the original ZIP object after extraction/export. Those batches are
  // still durable recovery material: rebuild a recovery candidate from the batch
  // upload record when no learner-verified PUBLISHED receipt exists.
  const batches = await storage.listBatches();
  for (const summary of batches) {
    const batch = await storage.getBatch(summary.id) as UploadBatch | null;
    if (!batch) continue;
    for (const uploadRecord of batch.uploads ?? []) {
      const storagePath = uploadRecord.storagePath;
      if (!storagePath?.startsWith("uploads/courses/") || !storagePath.toLowerCase().endsWith(".zip") || seen.has(storagePath) || ingested.has(storagePath)) continue;
      const receipt = await getUploadReceipt(uploadRecord.id);
      if (receipt?.state === "PUBLISHED") continue;
      if (receipt?.state === "FAILED" && receipt.retryable === false) continue;
      seen.add(storagePath);
      candidates.push({ batchId: uploadRecord.batchId ?? batch.id, upload: { uploadId: uploadRecord.id, originalFilename: uploadRecord.originalFilename, mimeType: uploadRecord.mimeType || "application/zip", sizeBytes: uploadRecord.sizeBytes ?? 0, storagePath } });
    }
  }
  return candidates;
}

/**
 * Stable reconciliation identity shared by every curriculum level and locale.
 * No level or language allow-list belongs here: validation is delegated to the
 * central upload/language configuration so L1-L5 and future locales use the
 * same recovery and restoration machinery.
 */
export function toReconciliationKey(identity: ReturnType<typeof inferCurriculumPackageIdentity>) {
  return `${identity.track.toUpperCase()}:L${identity.level.replace("level-", "")}:${identity.language}`;
}

const MULTI_LOCALE_BUNDLE = /(?:^|[-_ .])all[-_ ]?(?:locales?|languages?)(?:[-_ .]|$)/iu;
export const MULTI_LOCALE_BUNDLE_ERROR = "Multi-locale bundle: recover each per-locale package individually.";
export function isMultiLocaleBundleFilename(filename: string): boolean { return MULTI_LOCALE_BUNDLE.test(filename.replace(/\.zip$/iu, "")); }

export async function getRecoverableCurriculumPackages(): Promise<RecoverableCurriculumPackage[]> {
  const candidates = await getRecoverableUploads();
  return candidates.map((candidate) => {
    if (isMultiLocaleBundleFilename(candidate.upload.originalFilename)) return { ...candidate, identity: null, classificationError: MULTI_LOCALE_BUNDLE_ERROR, reconciliationKey: null };
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
