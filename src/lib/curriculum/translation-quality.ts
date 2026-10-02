import type { PublishedLessonRecord, PublishedLessonTranslation } from "@/lib/curriculum/authoritative-published";

/**
 * Learner-safety classifier for translations already stored in the repository
 * or durable publication stores.
 *
 * A stored translation is publishable when it contains a real body and is not
 * one of the explicit placeholder records used by older recovery tooling.
 * Do not reject an otherwise valid localized lesson merely because its body is
 * shorter than the canonical English lesson. That length heuristic hid large
 * portions of the existing Level 2 corpus and forced English fallback even
 * though localized files were present.
 */
export function isLearnerReadyTranslation(
  _lesson: PublishedLessonRecord,
  translation: PublishedLessonTranslation | undefined,
): translation is PublishedLessonTranslation {
  if (!translation) return false;

  const body = translation.body?.trim();
  if (!body) return false;

  if (/^Localized curriculum content for\b/iu.test(body)) return false;

  return true;
}
