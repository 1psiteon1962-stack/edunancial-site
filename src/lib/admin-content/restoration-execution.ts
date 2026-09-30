import type { RecoverableCurriculumPackage } from "@/lib/admin-content/recovery-discovery";

const CURRENT_RECOVERY_LEVELS = new Set(["level-1", "level-2", "level-3"]);

export type RestorationExecutionCandidate = {
  package: RecoverableCurriculumPackage;
  eligible: boolean;
  reason: "eligible-existing-l1-l3" | "not-currently-uploaded-l4-l5" | "unclassified";
};

/**
 * Current recovery scope reflects the material that can actually exist in
 * persistent upload storage today. The executor architecture remains L1-L5;
 * this selector prevents L4/L5 from being reported as lost recovery work
 * before those English packages have been uploaded.
 */
export function selectExistingRestorationCandidates(
  packages: RecoverableCurriculumPackage[],
): RestorationExecutionCandidate[] {
  return packages.map((candidate) => {
    if (!candidate.identity || !candidate.reconciliationKey) {
      return { package: candidate, eligible: false, reason: "unclassified" };
    }
    if (!CURRENT_RECOVERY_LEVELS.has(candidate.identity.level)) {
      return { package: candidate, eligible: false, reason: "not-currently-uploaded-l4-l5" };
    }
    return { package: candidate, eligible: true, reason: "eligible-existing-l1-l3" };
  });
}
