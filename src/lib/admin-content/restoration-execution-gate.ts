import type { RecoverableCurriculumPackage } from "@/lib/admin-content/recovery-discovery";
import { orderVerifiedRestorationPackages } from "@/lib/admin-content/restoration-order";
import { assessRestorationExecutionReadiness } from "@/lib/admin-content/restoration-readiness";
import { verifyExistingRestorationPackages } from "@/lib/admin-content/restoration-verification";

export type RestorationExecutionDecision = {
  allowed: boolean;
  reason: "ready" | "not-ready" | "not-verified";
  reconciliationKey: string | null;
  canonicalLessonCount: number | null;
};

/**
 * Recomputes the exact verified L1-L3 restoration set immediately before a
 * recovery write. No caller can turn a planner result into permission.
 */
export async function decideRestorationExecution(
  packages: RecoverableCurriculumPackage[],
  target: RecoverableCurriculumPackage,
): Promise<RestorationExecutionDecision> {
  const key = target.reconciliationKey;
  if (!key) return { allowed: false, reason: "not-verified", reconciliationKey: null, canonicalLessonCount: null };

  const verification = verifyExistingRestorationPackages(packages);
  const ordered = orderVerifiedRestorationPackages(verification);
  const readiness = await assessRestorationExecutionReadiness(ordered);
  const targetReadiness = readiness.find((entry) =>
    entry.reconciliationKey === key
    && entry.verification.package.batchId === target.batchId
    && entry.verification.package.upload.uploadId === target.upload.uploadId
  );

  if (!targetReadiness) {
    return { allowed: false, reason: "not-verified", reconciliationKey: key, canonicalLessonCount: null };
  }

  return {
    allowed: targetReadiness.executionReady,
    reason: targetReadiness.executionReady ? "ready" : "not-ready",
    reconciliationKey: key,
    canonicalLessonCount: targetReadiness.canonicalLessonCount,
  };
}
