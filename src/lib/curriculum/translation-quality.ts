import type { PublishedLessonRecord, PublishedLessonTranslation } from "@/lib/curriculum/authoritative-published";

/**
 * Transitional learner-safety classifier.
 *
 * Phase 0 classifies only the recovered Level 2 locale corpus. Existing
 * localization behavior for every other level remains unchanged, including
 * valid partial translations whose missing fields fall back to English.
 */
export function isLearnerReadyTranslation(
  lesson: PublishedLessonRecord,
  translation: PublishedLessonTranslation | undefined,
): translation is PublishedLessonTranslation {
  if (!translation) return false;

  if (lesson.level !== 2) return true;

  const body = translation.body?.trim();
  if (!body) return false;

  if (/^Localized curriculum content for\b/iu.test(body)) return false;

  const canonicalBody = lesson.body.trim();
  if (
    canonicalBody.length >= 2000 &&
    body.length < 1500 &&
    body.length < canonicalBody.length * 0.5
  ) {
    return false;
  }

  return true;
}
