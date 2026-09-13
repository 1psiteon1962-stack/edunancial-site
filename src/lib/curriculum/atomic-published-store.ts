import type { PublishedLessonRecord, PublishedLessonTranslation } from "@/lib/curriculum/authoritative-published";
import { getLessonContent, readRegistry } from "@/lib/curriculum/reader";

/**
 * Transitional repository-backed publication-store adapter.
 *
 * Public production curriculum no longer reads Supabase. Level 1 is seeded
 * directly from the committed authoritative registry in production so the
 * foundational curriculum remains available. Non-production callers retain
 * the unavailable-store contract used by upload/deletion tests and local
 * publication workflows. Levels 2 and 3 continue through the authoritative
 * resolver, which combines registry and committed course sources.
 */
export async function readAtomicPublishedLessons(): Promise<PublishedLessonRecord[] | null> {
  if (process.env.NODE_ENV !== "production") return null;

  const registry = readRegistry();
  const lessons: PublishedLessonRecord[] = [];

  for (const track of Object.values(registry.tracks)) {
    for (const level of Object.values(track.levels)) {
      for (const asset of Object.values(level.assets)) {
        if (asset.type !== "lesson" || asset.status !== "active" || asset.level !== 1 || typeof asset.lessonNumber !== "number") continue;

        const content = getLessonContent(asset.id, "en");
        lessons.push({
          id: asset.id,
          track: asset.track,
          trackName: asset.trackName || track.name || asset.track,
          level: asset.level,
          lessonNumber: asset.lessonNumber,
          title: content?.meta.title ?? asset.title,
          summary: content?.meta.summary ?? asset.metadata?.summary ?? "",
          author: content?.meta.author ?? asset.author,
          date: content?.meta.date ?? asset.date,
          version: content?.meta.version ?? asset.version,
          status: "active",
          importedAt: content?.meta.importedAt ?? asset.importedAt,
          metadata: asset.metadata ?? {},
          path: asset.path,
          body: content?.body ?? "",
          frontMatter: content?.frontMatter ?? {},
        });
      }
    }
  }

  return lessons.length ? lessons : null;
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
