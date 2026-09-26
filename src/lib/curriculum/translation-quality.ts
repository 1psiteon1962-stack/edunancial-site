import type { PublishedLessonRecord, PublishedLessonTranslation } from "@/lib/curriculum/authoritative-published";

/**
 * Transitional learner-safety classifier.
 *
 * The recovered Level 2 locale corpus contains short template/placeholder
 * records that must not outrank the complete canonical lesson. This guard is
 * intentionally conservative and read-only: it does not delete or rewrite
 * any source content. The compiled curriculum architecture will replace this
 * heuristic with explicit quality status in the normalized LessonRecord.
 */
export function isLearnerReadyTranslation(
  lesson: PublishedLessonRecord,
  translation: PublishedLessonTranslation | undefined,
): translation is PublishedLessonTranslation {
  const body = translation?.body?.trim();
  if (!body) return false;

  if (lesson.level !== 2) return true;\n\n  if (/^Localized curriculum content for\b/iu.test(body)) return false;

  const canonicalBody = lesson.body.trim();
  if (
    lesson.level === 2 &&
    canonicalBody.length >= 2000 &&
    body.length < 1500 &&
    body.length < canonicalBody.length * 0.5
  ) {
    return false;
  }

  return true;
}
