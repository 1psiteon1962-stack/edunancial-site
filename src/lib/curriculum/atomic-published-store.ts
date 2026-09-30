import { Buffer } from "node:buffer";

import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { PublishedLessonRecord, PublishedLessonTranslation } from "@/lib/curriculum/authoritative-published";
import { getLessonContent, readRegistry } from "@/lib/curriculum/reader";

const ATOMIC_ROOT = "published/atomic";
const LESSONS_ROOT = `${ATOMIC_ROOT}/lessons`;
const BATCHES_ROOT = `${ATOMIC_ROOT}/batches`;
const LESSON_INDEX_PATH = `${ATOMIC_ROOT}/lesson-index.json`;

function safeKey(value: string): string {
  return value.trim().replace(/[^A-Za-z0-9._-]+/gu, "_");
}

function lessonPath(id: string): string {
  return `${LESSONS_ROOT}/${safeKey(id.toUpperCase())}.json`;
}

function batchPath(batchId: string): string {
  return `${BATCHES_ROOT}/${safeKey(batchId)}.json`;
}

async function readJson<T>(path: string): Promise<T | null> {
  const raw = await getAdminContentStorage().readBinary(path);
  if (!raw) return null;
  try { return JSON.parse(raw.toString("utf8")) as T; } catch { return null; }
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await getAdminContentStorage().saveBinary(
    path,
    Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8"),
    "application/json",
  );
}

function registryLevelOne(): PublishedLessonRecord[] {
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
  return lessons;
}

/**
 * Atomic curriculum state is stored as one durable object per lesson. Recovery
 * therefore changes only the requested lesson coordinate instead of rewriting
 * published/curriculum-state.json. Repository L1 remains authoritative when
 * present; durable atomic rows add recovered L2/L3 and their translations.
 */
export async function readAtomicPublishedLessons(): Promise<PublishedLessonRecord[] | null> {
  if (process.env.NODE_ENV !== "production") return null;
  const byId = new Map(registryLevelOne().map((lesson) => [lesson.id.toUpperCase(), lesson]));
  const lessonIds = await readJson<string[]>(LESSON_INDEX_PATH) ?? [];
  for (const lessonId of lessonIds) {
    const lesson = await readJson<PublishedLessonRecord>(lessonPath(lessonId));
    if (!lesson?.id || lesson.status !== "active") continue;
    const id = lesson.id.toUpperCase();
    const repository = byId.get(id);
    byId.set(id, repository && repository.level === 1
      ? { ...repository, translations: lesson.translations ?? repository.translations }
      : lesson);
  }
  return byId.size ? [...byId.values()] : null;
}

export async function upsertAtomicPublishedLessons(batchId: string, lessons: PublishedLessonRecord[]): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") return false;
  if (!lessons.length) return true;
  try {
    const ids: string[] = [];
    for (const lesson of lessons) {
      const id = lesson.id.toUpperCase();
      const existing = await readJson<PublishedLessonRecord>(lessonPath(id));
      await writeJson(lessonPath(id), {
        ...lesson,
        id,
        ...(existing?.translations ? { translations: existing.translations } : {}),
        importedAt: new Date().toISOString(),
      });
      ids.push(id);
    }
    await writeJson(batchPath(batchId), [...new Set(ids)].sort());
    const indexed = await readJson<string[]>(LESSON_INDEX_PATH) ?? [];
    await writeJson(LESSON_INDEX_PATH, [...new Set([...indexed, ...ids])].sort());
    return true;
  } catch {
    return false;
  }
}

export async function upsertAtomicPublishedTranslation(
  lessonId: string,
  locale: string,
  translation: PublishedLessonTranslation,
): Promise<boolean | null> {
  if (process.env.NODE_ENV !== "production") return null;
  try {
    const id = lessonId.toUpperCase();
    let lesson = await readJson<PublishedLessonRecord>(lessonPath(id));
    if (!lesson) {
      lesson = registryLevelOne().find((entry) => entry.id.toUpperCase() === id) ?? null;
    }
    if (!lesson) return false;
    const translations = lesson.translations ?? {};
    await writeJson(lessonPath(id), {
      ...lesson,
      id,
      translations: { ...translations, [locale]: translation },
    });
    return true;
  } catch {
    return null;
  }
}

export async function removeAtomicPublishedBatch(batchId: string): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") return false;
  try {
    const ids = await readJson<string[]>(batchPath(batchId));
    if (!ids) return false;
    for (const id of ids) await getAdminContentStorage().deleteBinary(lessonPath(id));
    await getAdminContentStorage().deleteBinary(batchPath(batchId));
    const indexed = await readJson<string[]>(LESSON_INDEX_PATH) ?? [];
    const removed = new Set(ids.map((id) => id.toUpperCase()));
    await writeJson(LESSON_INDEX_PATH, indexed.filter((id) => !removed.has(id.toUpperCase())));
    return true;
  } catch {
    return false;
  }
}

export async function removeAtomicPublishedLesson(lessonId: string): Promise<boolean | null> {
  if (process.env.NODE_ENV !== "production") return null;
  try {
    const path = lessonPath(lessonId);
    if (!await getAdminContentStorage().readBinary(path)) return false;
    await getAdminContentStorage().deleteBinary(path);
    const indexed = await readJson<string[]>(LESSON_INDEX_PATH) ?? [];
    await writeJson(LESSON_INDEX_PATH, indexed.filter((id) => id.toUpperCase() !== lessonId.toUpperCase()));
    return true;
  } catch {
    return null;
  }
}
