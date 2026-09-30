import type { RecoverableCurriculumPackage } from "@/lib/admin-content/recovery-discovery";

export type RestorationGap = { track: string; level: number; locale: string; classification: string };
export type RestorationMatch = { reconciliationKey: string; gap: RestorationGap; package: RecoverableCurriculumPackage };
export type RestorationPlan = { restorable: RestorationMatch[]; unresolved: RestorationGap[]; conflicts: RestorationGap[]; unmatchedPackages: RecoverableCurriculumPackage[] };

export function restorationGapKey(gap: RestorationGap) {
  return `${gap.track.toUpperCase()}:L${gap.level}:${gap.locale}`;
}

export function buildRestorationPlan(gaps: RestorationGap[], packages: RecoverableCurriculumPackage[]): RestorationPlan {
  const packageMap = new Map<string, RecoverableCurriculumPackage[]>();
  for (const candidate of packages) {
    if (!candidate.reconciliationKey || !candidate.identity) continue;
    const list = packageMap.get(candidate.reconciliationKey) ?? [];
    list.push(candidate);
    packageMap.set(candidate.reconciliationKey, list);
  }
  const restorable: RestorationMatch[] = [], unresolved: RestorationGap[] = [], conflicts: RestorationGap[] = [];
  const used = new Set<RecoverableCurriculumPackage>(), grouped = new Map<string, RestorationGap[]>();
  for (const gap of gaps) {
    if (gap.classification === "canonical") continue;
    const key = restorationGapKey(gap), list = grouped.get(key) ?? [];
    list.push(gap); grouped.set(key, list);
  }
  for (const [key, coordinateGaps] of grouped) {
    if (coordinateGaps.some(gap => gap.classification === "conflict")) { conflicts.push(...coordinateGaps); continue; }
    const candidates = packageMap.get(key) ?? [];
    if (candidates.length !== 1) { unresolved.push(...coordinateGaps); continue; }
    const candidate = candidates[0]; used.add(candidate);
    for (const gap of coordinateGaps) restorable.push({ reconciliationKey: key, gap, package: candidate });
  }
  return { restorable, unresolved, conflicts, unmatchedPackages: packages.filter(candidate => !used.has(candidate)) };
}
