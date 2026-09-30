import type { OrderedRestorationPackage } from "@/lib/admin-content/restoration-order";
import { exportPublishedLessonTranslations } from "@/lib/curriculum/authoritative-published";

export type RestorationExecutionReadiness = OrderedRestorationPackage & {
  canonicalLessonCount: number;
  executionReady: boolean;
  readinessReason: "canonical-package" | "canonical-already-published" | "missing-canonical-lessons";
};

/**
 * Joins the verified stored-package order with learner-visible canonical
 * evidence. Localized restoration may proceed only when its canonical package
 * is in the verified set or all 50 canonical lessons are already resolvable.
 * This is read-only and never publishes curriculum.
 */
export async function assessRestorationExecutionReadiness(
  ordered: OrderedRestorationPackage[],
): Promise<RestorationExecutionReadiness[]> {
  const cache = new Map<string, number>();
  const result: RestorationExecutionReadiness[] = [];

  for (const entry of ordered) {
    if (entry.phase === "canonical") {
      result.push({
        ...entry,
        canonicalLessonCount: 50,
        executionReady: true,
        readinessReason: "canonical-package",
      });
      continue;
    }

    if (!entry.blockedByCanonical) {
      result.push({
        ...entry,
        canonicalLessonCount: 50,
        executionReady: true,
        readinessReason: "canonical-package",
      });
      continue;
    }

    let canonicalLessonCount = cache.get(entry.canonicalKey);
    if (canonicalLessonCount === undefined) {
      const identity = entry.verification.package.identity!;
      const level = identity.level.replace("level-", "");
      const lessons = await exportPublishedLessonTranslations({
        prefixes: [`${identity.track.toUpperCase()}-L${level}`],
      });
      canonicalLessonCount = new Set(lessons.map((lesson) => lesson.id)).size;
      cache.set(entry.canonicalKey, canonicalLessonCount);
    }

    const executionReady = canonicalLessonCount === 50;
    result.push({
      ...entry,
      canonicalLessonCount,
      executionReady,
      readinessReason: executionReady ? "canonical-already-published" : "missing-canonical-lessons",
    });
  }

  return result;
}
