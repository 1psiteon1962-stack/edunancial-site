import { Buffer } from "node:buffer";

import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type {
  PublishedCurriculumState,
  PublishedLessonRecord,
} from "@/lib/curriculum/authoritative-published";
import { getLessonContent, readRegistry, type RegistryAsset } from "@/lib/curriculum/reader";

const PUBLISHED_STATE_PATH = "published/curriculum-state.json";

function emptyState(): PublishedCurriculumState {
  return {
    schemaVersion: "1.0",
    initialized: true,
    updatedAt: new Date().toISOString(),
    lessons: {},
    batchLessonIds: {},
  };
}

async function readState(): Promise<PublishedCurriculumState> {
  const buffer = await getAdminContentStorage().readBinary(PUBLISHED_STATE_PATH);
  if (!buffer) return emptyState();

  try {
    const parsed = JSON.parse(buffer.toString("utf8")) as Partial<PublishedCurriculumState>;
    return {
      schemaVersion: "1.0",
      initialized: Boolean(parsed.initialized),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
      lessons: parsed.lessons && typeof parsed.lessons === "object" ? parsed.lessons : {},
      batchLessonIds:
        parsed.batchLessonIds && typeof parsed.batchLessonIds === "object"
          ? parsed.batchLessonIds
          : {},
    };
  } catch {
    return emptyState();
  }
}

function recordFromRegistry(asset: RegistryAsset): PublishedLessonRecord | null {
  if (asset.type !== "lesson" || asset.status !== "active" || typeof asset.lessonNumber !== "number") {
    return null;
  }

  const content = getLessonContent(asset.id, "en");
  if (content) {
    return {
      id: asset.id,
      track: asset.track,
      trackName: asset.trackName || asset.track,
      level: asset.level,
      lessonNumber: asset.lessonNumber,
      title: content.meta.title,
      summary: content.meta.summary,
      author: content.meta.author,
      date: content.meta.date,
      version: content.meta.version,
      status: "active",
      importedAt: content.meta.importedAt,
      metadata: asset.metadata ?? {},
      path: asset.path,
      body: content.body,
      frontMatter: content.frontMatter,
    };
  }

  return {
    id: asset.id,
    track: asset.track,
    trackName: asset.trackName || asset.track,
    level: asset.level,
    lessonNumber: asset.lessonNumber,
    title: asset.title,
    summary: asset.metadata?.summary ?? "",
    author: asset.author,
    date: asset.date,
    version: asset.version,
    status: "active",
    importedAt: asset.importedAt,
    metadata: asset.metadata ?? {},
    path: asset.path,
    body: "",
    frontMatter: {},
  };
}

/**
 * Populate only missing canonical English lessons for the requested tracks.
 * Existing published lessons and their translations are never replaced.
 * The state is written once so large recovery jobs do not incur one storage
 * write per lesson or hit serverless request timeouts unnecessarily.
 */
export async function backfillMissingPublishedLessonsFromRegistry(
  trackCodes: Iterable<string>,
): Promise<{ added: number; alreadyPublished: number; skipped: number; byTrack: Record<string, number> }> {
  const allowed = new Set([...trackCodes].map((track) => track.trim().toUpperCase()).filter(Boolean));
  const state = await readState();
  const registry = readRegistry();
  const byTrack: Record<string, number> = {};
  let added = 0;
  let alreadyPublished = 0;
  let skipped = 0;

  for (const track of Object.values(registry.tracks)) {
    const trackCode = track.code.toUpperCase();
    if (!allowed.has(trackCode)) continue;

    for (const level of Object.values(track.levels)) {
      for (const asset of Object.values(level.assets)) {
        if (asset.type !== "lesson") continue;
        const lessonId = asset.id.toUpperCase();
        if (state.lessons[lessonId]) {
          alreadyPublished += 1;
          continue;
        }

        const record = recordFromRegistry(asset);
        if (!record) {
          skipped += 1;
          continue;
        }

        state.lessons[lessonId] = record;
        added += 1;
        byTrack[trackCode] = (byTrack[trackCode] ?? 0) + 1;
      }
    }
  }

  if (added > 0) {
    state.initialized = true;
    state.updatedAt = new Date().toISOString();
    await getAdminContentStorage().saveBinary(
      PUBLISHED_STATE_PATH,
      Buffer.from(`${JSON.stringify(state, null, 2)}\n`, "utf8"),
      "application/json",
    );
  }

  return { added, alreadyPublished, skipped, byTrack };
}
