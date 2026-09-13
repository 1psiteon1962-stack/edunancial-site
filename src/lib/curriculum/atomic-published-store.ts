import type { PublishedLessonRecord, PublishedLessonTranslation } from "@/lib/curriculum/authoritative-published";

/**
 * Transitional atomic publication-store adapter.
 *
 * Edunancial public curriculum no longer uses Supabase. Returning the
 * unavailable sentinel keeps authoritative curriculum reads on the committed
 * in-repository curriculum path. The write methods retain their existing
 * result contracts so callers can fall back to the non-Supabase publication
 * path without importing or initializing Supabase during Server Component
 * rendering.
 */
export async function readAtomicPublishedLessons(): Promise<PublishedLessonRecord[] | null> {
  return null;
}

export async function upsertAtomicPublishedLessons(_batchId: string, _lessons: PublishedLessonRecord[]): Promise<boolean> {
  return false;
}

export async function upsertAtomicPublishedTranslation(
  _lessonId: string,
  _locale: string,
  _translation: PublishedLessonTranslation,
): Promise<boolean | null> {
  return null;
}

export async function removeAtomicPublishedBatch(_batchId: string): Promise<boolean> {
  return false;
}

export async function removeAtomicPublishedLesson(_lessonId: string): Promise<boolean | null> {
  return null;
}
