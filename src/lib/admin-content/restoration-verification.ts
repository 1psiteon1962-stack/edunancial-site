import type { RecoverableCurriculumPackage } from "@/lib/admin-content/recovery-discovery";
import { selectExistingRestorationCandidates } from "@/lib/admin-content/restoration-execution";

export type RestorationVerification = {
  reconciliationKey: string;
  package: RecoverableCurriculumPackage;
  status: "ready-single-package" | "duplicate-coordinate" | "unclassified" | "outside-current-l1-l3-scope";
  candidateCount: number;
};

/**
 * Read-only verification for the current restoration scope. A package is only
 * ready when it is classified as existing L1-L3 material and is the sole
 * recoverable package for its track/level/locale coordinate.
 */
export function verifyExistingRestorationPackages(
  packages: RecoverableCurriculumPackage[],
): RestorationVerification[] {
  const selected = selectExistingRestorationCandidates(packages);
  const counts = new Map<string, number>();
  for (const candidate of packages) {
    if (!candidate.reconciliationKey) continue;
    counts.set(candidate.reconciliationKey, (counts.get(candidate.reconciliationKey) ?? 0) + 1);
  }

  return selected.map((entry) => {
    const key = entry.package.reconciliationKey ?? "";
    const candidateCount = key ? counts.get(key) ?? 0 : 0;
    if (!entry.package.identity || !key) {
      return { reconciliationKey: key, package: entry.package, status: "unclassified", candidateCount };
    }
    if (!entry.eligible) {
      return { reconciliationKey: key, package: entry.package, status: "outside-current-l1-l3-scope", candidateCount };
    }
    if (candidateCount !== 1) {
      return { reconciliationKey: key, package: entry.package, status: "duplicate-coordinate", candidateCount };
    }
    return { reconciliationKey: key, package: entry.package, status: "ready-single-package", candidateCount };
  });
}
