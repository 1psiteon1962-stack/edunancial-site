import type { PublishedLessonRecord } from "@/lib/curriculum/authoritative-published";
import { readAtomicPublishedLessons, upsertAtomicPublishedLessons } from "@/lib/curriculum/atomic-published-store";
import { getLessonContent, readRegistry, type RegistryAsset } from "@/lib/curriculum/reader";

function recordFromRegistry(asset: RegistryAsset): PublishedLessonRecord | null {
  if (asset.type !== "lesson" || asset.status !== "active" || typeof asset.lessonNumber !== "number") return null;
  const content = getLessonContent(asset.id, "en");
  if (content) {
    return {
      id: asset.id, track: asset.track, trackName: asset.trackName || asset.track,
      level: asset.level, lessonNumber: asset.lessonNumber, title: content.meta.title,
      summary: content.meta.summary, author: content.meta.author, date: content.meta.date,
      version: content.meta.version, status: "active", importedAt: content.meta.importedAt,
      metadata: asset.metadata ?? {}, path: asset.path, body: content.body, frontMatter: content.frontMatter,
    };
  }
  return {
    id: asset.id, track: asset.track, trackName: asset.trackName || asset.track,
    level: asset.level, lessonNumber: asset.lessonNumber, title: asset.title,
    summary: asset.metadata?.summary ?? "", author: asset.author, date: asset.date,
    version: asset.version, status: "active", importedAt: asset.importedAt,
    metadata: asset.metadata ?? {}, path: asset.path, body: "", frontMatter: {},
  };
}

/**
 * Populate missing canonical English lessons into the atomic published store.
 * This intentionally never rewrites published/curriculum-state.json. Legacy
 * state remains readable during consolidation, but reconciliation cannot make
 * it a competing write authority.
 */
export async function backfillMissingPublishedLessonsFromRegistry(
  trackCodes: Iterable<string>,
): Promise<{ added: number; alreadyPublished: number; skipped: number; byTrack: Record<string, number> }> {
  const allowed = new Set([...trackCodes].map((track) => track.trim().toUpperCase()).filter(Boolean));
  const atomic = await readAtomicPublishedLessons();
  const existing = new Set((atomic ?? []).map((lesson) => lesson.id.toUpperCase()));
  const registry = readRegistry();
  const byTrack: Record<string, number> = {};
  let added = 0;
  let alreadyPublished = 0;
  let skipped = 0;

  for (const track of Object.values(registry.tracks)) {
    const trackCode = track.code.toUpperCase();
    if (!allowed.has(trackCode)) continue;
    const pending: PublishedLessonRecord[] = [];

    for (const level of Object.values(track.levels)) {
      for (const asset of Object.values(level.assets)) {
        if (asset.type !== "lesson") continue;
        const lessonId = asset.id.toUpperCase();
        if (existing.has(lessonId)) {
          alreadyPublished += 1;
          continue;
        }
        const record = recordFromRegistry(asset);
        if (!record) {
          skipped += 1;
          continue;
        }
        pending.push(record);
        existing.add(lessonId);
      }
    }

    if (!pending.length) continue;
    const persisted = await upsertAtomicPublishedLessons(`registry-backfill:${trackCode}`, pending);
    if (!persisted) {
      throw new Error(`Atomic curriculum publication is unavailable; refusing legacy full-state backfill for ${trackCode}.`);
    }
    added += pending.length;
    byTrack[trackCode] = pending.length;
  }

  return { added, alreadyPublished, skipped, byTrack };
}
