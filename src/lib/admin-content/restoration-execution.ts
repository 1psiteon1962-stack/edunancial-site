import type { RecoverableCurriculumPackage } from "@/lib/admin-content/recovery-discovery";

const SUPPORTED_RECOVERY_LEVELS = new Set(["level-1", "level-2", "level-3", "level-4", "level-5"]);

export type RestorationExecutionCandidate = {
  package: RecoverableCurriculumPackage;
  eligible: boolean;
  reason: "eligible-supported-level" | "unsupported-level" | "unclassified";
};

/**
 * Recovery follows the uploader's supported curriculum levels. A package that
 * actually exists in persistent storage must not be rejected merely because it
 * is L4 or L5. Canonical prerequisite checks remain enforced downstream.
 */
export function selectExistingRestorationCandidates(
  packages: RecoverableCurriculumPackage[],
): RestorationExecutionCandidate[] {
  return packages.map((candidate) => {
    if (!candidate.identity || !candidate.reconciliationKey) {
      return { package: candidate, eligible: false, reason: "unclassified" };
    }
    if (!SUPPORTED_RECOVERY_LEVELS.has(candidate.identity.level)) {
      return { package: candidate, eligible: false, reason: "unsupported-level" };
    }
    return { package: candidate, eligible: true, reason: "eligible-supported-level" };
  });
}
