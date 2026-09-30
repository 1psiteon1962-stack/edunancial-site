import type { RestorationExecutionManifestEntry } from "@/lib/admin-content/restoration-execution-manifest";

export type RestorationReconciliationEntry = RestorationExecutionManifestEntry & {
  verifiedComplete: boolean;
};

export type RestorationReconciliation = {
  total: number;
  verified: number;
  remaining: number;
  complete: boolean;
  entries: RestorationReconciliationEntry[];
};

export function reconcileRestorationExecution(
  manifest: RestorationExecutionManifestEntry[],
  completed: ReadonlyArray<{ batchId: string; uploadId: string }>,
): RestorationReconciliation {
  const completedKeys = new Set(completed.map((entry) => `${entry.batchId}::${entry.uploadId}`));
  const entries = manifest.map((entry) => ({
    ...entry,
    verifiedComplete: completedKeys.has(`${entry.batchId}::${entry.uploadId}`),
  }));
  const verified = entries.filter((entry) => entry.verifiedComplete).length;
  return {
    total: entries.length,
    verified,
    remaining: entries.length - verified,
    complete: entries.length > 0 && verified === entries.length,
    entries,
  };
}
