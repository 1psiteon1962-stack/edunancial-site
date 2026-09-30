import type { RecoverableCurriculumPackage } from "@/lib/admin-content/recovery-discovery";
import { orderVerifiedRestorationPackages } from "@/lib/admin-content/restoration-order";
import { assessRestorationExecutionReadiness } from "@/lib/admin-content/restoration-readiness";
import { buildRestorationExecutionManifest } from "@/lib/admin-content/restoration-execution-manifest";
import { buildRestorationExecutionSteps, nextRestorationExecutionStep } from "@/lib/admin-content/restoration-execution-runner";
import { verifyExistingRestorationPackages } from "@/lib/admin-content/restoration-verification";

export type ControlledRestorationDecision = {
  allowed: boolean;
  reason: "next-step" | "out-of-order" | "not-ready";
  expectedBatchId: string | null;
  expectedUploadId: string | null;
  expectedSequence: number | null;
};

export async function decideControlledRestorationStep(
  packages: RecoverableCurriculumPackage[],
  target: RecoverableCurriculumPackage,
  completedSequences: ReadonlySet<number>,
): Promise<ControlledRestorationDecision> {
  const verification = verifyExistingRestorationPackages(packages);
  const order = orderVerifiedRestorationPackages(verification);
  const readiness = await assessRestorationExecutionReadiness(order);
  const manifest = buildRestorationExecutionManifest(readiness);
  const steps = buildRestorationExecutionSteps(manifest);
  const next = nextRestorationExecutionStep(steps, completedSequences);

  if (!next) {
    return { allowed: false, reason: "not-ready", expectedBatchId: null, expectedUploadId: null, expectedSequence: null };
  }

  const allowed = next.batchId === target.batchId && next.uploadId === target.upload.uploadId;
  return {
    allowed,
    reason: allowed ? "next-step" : "out-of-order",
    expectedBatchId: next.batchId,
    expectedUploadId: next.uploadId,
    expectedSequence: next.sequence,
  };
}
