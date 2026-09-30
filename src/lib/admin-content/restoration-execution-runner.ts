import type { RestorationExecutionManifestEntry } from "@/lib/admin-content/restoration-execution-manifest";

export type RestorationExecutionStep = RestorationExecutionManifestEntry & {
  previousSequence: number | null;
  requiresCanonicalVerification: boolean;
};

export function buildRestorationExecutionSteps(
  manifest: RestorationExecutionManifestEntry[],
): RestorationExecutionStep[] {
  return manifest.map((entry, index) => ({
    ...entry,
    previousSequence: index === 0 ? null : manifest[index - 1]!.sequence,
    requiresCanonicalVerification: entry.phase === "localized",
  }));
}

export function nextRestorationExecutionStep(
  steps: RestorationExecutionStep[],
  completedSequences: ReadonlySet<number>,
): RestorationExecutionStep | null {
  for (const step of steps) {
    if (completedSequences.has(step.sequence)) continue;
    if (step.previousSequence !== null && !completedSequences.has(step.previousSequence)) return null;
    return step;
  }
  return null;
}
