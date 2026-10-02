import type { PublishedLessonRecord, PublishedLessonTranslation } from "@/lib/curriculum/authoritative-published";

/**
 * Learner-safety classifier for translations already stored in the repository
 * or durable publication stores.
 *
 * Existing partial-translation behavior for Levels other than 2 is preserved.
 * For Level 2, require a real body and reject only explicit legacy placeholder
 * records. Do not hide a real stored Level 2 translation merely because it is
 * shorter than the canonical English lesson.
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

  return true;
}
