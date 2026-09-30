import type { RestorationExecutionReadiness } from "@/lib/admin-content/restoration-readiness";

export type RestorationExecutionManifestEntry = {
  sequence: number;
  batchId: string;
  uploadId: string;
  reconciliationKey: string;
  canonicalKey: string;
  phase: "canonical" | "localized";
  canonicalLessonCount: number;
  ready: boolean;
};

export function buildRestorationExecutionManifest(
  readiness: RestorationExecutionReadiness[],
): RestorationExecutionManifestEntry[] {
  return readiness
    .filter((entry) => entry.executionReady)
    .map((entry, index) => ({
      sequence: index + 1,
      batchId: entry.verification.package.batchId,
      uploadId: entry.verification.package.upload.uploadId,
      reconciliationKey: entry.reconciliationKey,
      canonicalKey: entry.canonicalKey,
      phase: entry.phase,
      canonicalLessonCount: entry.canonicalLessonCount,
      ready: true,
    }));
}
