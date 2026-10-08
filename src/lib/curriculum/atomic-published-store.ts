import { Buffer } from "node:buffer";

import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { PublishedLessonRecord, PublishedLessonTranslation } from "@/lib/curriculum/authoritative-published";
import { getLessonContent, readRegistry } from "@/lib/curriculum/reader";

const ATOMIC_ROOT = "published/atomic";
const LESSONS_ROOT = `${ATOMIC_ROOT}/lessons`;
const BATCHES_ROOT = `${ATOMIC_ROOT}/batches`;
const LESSON_INDEX_PATH = `${ATOMIC_ROOT}/lesson-index.json`;
export const CANONICAL_PUBLICATION_MARKER = "atomicCanonicalPublication";
export const CANONICAL_PUBLICATION_BATCH = "atomicCanonicalBatchId";

// Atomic reads currently go directly to durable storage. This hook is kept explicit so
// learner read-back can invalidate safely now and remains the single invalidation point
// when the bounded last-known-good cache is enabled.
export function invalidateAtomicPublishedCache(): void { atomicSnapshot = null; }

/**
 * Read diagnostics for the most recent full atomic read. The production auditor
 * reports these so a dropped or unreadable lesson row can never again look like
 * "content disappeared" without a recorded reason.
 */
export type AtomicReadDiagnostics = {
  at: string;
  indexedLessonIds: number;
  loadedLessons: number;
  failedLessonIds: string[];
  servedFromLastKnownGood: string[];
  missingObjects: string[];
  inactiveLessonIds: string[];
  indexReadError: string | null;
};
let lastDiagnostics: AtomicReadDiagnostics | null = null;
export function getLastAtomicReadDiagnostics(): AtomicReadDiagnostics | null { return lastDiagnostics; }

// Bounded per-instance memo of a COMPLETE read. Learner pages previously re-read
// every lesson object (two full reads per lesson page) which, under load, caused
// throttled rows to be silently dropped. A read with any failed row is never
// memoized, and rows that fail fall back to the last successfully read copy.
const SNAPSHOT_TTL_MS = 15_000;
let atomicSnapshot: { at: number; rows: PublishedLessonRecord[] | null } | null = null;
const lastKnownGood = new Map<string, PublishedLessonRecord>();
const ROW_READ_ATTEMPTS = 3;

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

/**
 * Compare-and-swap update of a single lesson object. Lesson objects hold the
 * canonical body AND every locale's translation, so a blind read-modify-write
 * lets two concurrent uploads (e.g. eight WHITE L3 locale ZIPs) erase each
 * other's translations. Every lesson-object mutation must go through here.
 */
async function updateLessonObject(
  id: string,
  mutate: (existing: PublishedLessonRecord | null) => PublishedLessonRecord | null,
): Promise<boolean> {
  const storage = getAdminContentStorage();
  const path = lessonPath(id);
  if (storage.updateBinary) {
    return storage.updateBinary(path, (current) => {
      let existing: PublishedLessonRecord | null = null;
      if (current) { try { existing = JSON.parse(current.toString("utf8")) as PublishedLessonRecord; } catch { existing = null; } }
      const next = mutate(existing);
      return next ? Buffer.from(`${JSON.stringify(next, null, 2)}\n`, "utf8") : null;
    }, `Update atomic curriculum lesson ${id}`);
  }
  const next = mutate(await readJson<PublishedLessonRecord>(path));
  if (!next) return false;
  await writeJson(path, next);
  return true;
}

async function readRowWithRetry(lessonId: string): Promise<{ row: PublishedLessonRecord | null; failed: boolean }> {
  for (let attempt = 0; attempt < ROW_READ_ATTEMPTS; attempt++) {
    try { return { row: await readJson<PublishedLessonRecord>(lessonPath(lessonId)), failed: false }; }
    catch { await new Promise((resolve) => setTimeout(resolve, 100 * (attempt + 1))); }
  }
  return { row: null, failed: true };
}

function repositoryCanonicalLessons(): PublishedLessonRecord[] {
  const registry = readRegistry();
  const lessons: PublishedLessonRecord[] = [];
  for (const track of Object.values(registry.tracks)) {
    for (const level of Object.values(track.levels)) {
      for (const asset of Object.values(level.assets)) {
        if (asset.type !== "lesson" || asset.status !== "active" || typeof asset.lessonNumber !== "number") continue;
        const content = getLessonContent(asset.id, "en");
        if (!content) continue;
        lessons.push({
          id: asset.id, track: asset.track, trackName: asset.trackName || track.name || asset.track,
          level: asset.level, lessonNumber: asset.lessonNumber, title: content.meta.title ?? asset.title,
          summary: content.meta.summary ?? asset.metadata?.summary ?? "", author: content.meta.author ?? asset.author,
          date: content.meta.date ?? asset.date, version: content.meta.version ?? asset.version, status: "active",
          importedAt: content.meta.importedAt ?? asset.importedAt, metadata: asset.metadata ?? {}, path: asset.path,
          body: content.body ?? "", frontMatter: { ...content.frontMatter, locale: "en" },
        });
      }
    }
  }
  return lessons;
}
function normalizedLocale(value: string | undefined): string { return (value ?? "en").trim().toLowerCase().replaceAll("_", "-"); }
function isCanonicalLocale(value: string | undefined): boolean { const locale=normalizedLocale(value); return locale==="en"||locale==="en-us"; }
type AtomicBatchEntry = { id: string; locale: string };
type AtomicBatchRecord = { version: 2; entries: AtomicBatchEntry[] };
async function updateLessonIndex(mutator:(ids:string[])=>string[]):Promise<void>{
  const storage=getAdminContentStorage();
  if(storage.updateBinary){
    const ok=await storage.updateBinary(LESSON_INDEX_PATH,(current)=>{
      let ids:string[]=[]; if(current){try{ids=JSON.parse(current.toString("utf8")) as string[];}catch{ids=[];}}
      return Buffer.from(`${JSON.stringify([...new Set(mutator(ids).map(id=>id.toUpperCase()))].sort(),null,2)}\n`,"utf8");
    },"Update atomic curriculum lesson index");
    if(!ok)throw new Error("Unable to update atomic curriculum lesson index."); return;
  }
  const indexed=await readJson<string[]>(LESSON_INDEX_PATH)??[]; await writeJson(LESSON_INDEX_PATH,mutator(indexed));
}

/**
 * Atomic curriculum state is stored as one durable object per lesson. Recovery
 * therefore changes only the requested lesson coordinate instead of rewriting
 * published/curriculum-state.json. Repository L1 remains authoritative when
 * present; durable atomic rows add recovered L2/L3 and their translations.
 */
export async function readAtomicPublishedLessons(): Promise<PublishedLessonRecord[] | null> {
  if (process.env.NODE_ENV !== "production") return null;
  try {
    const lessonIds = await readJson<string[]>(LESSON_INDEX_PATH) ?? [];
    if (!lessonIds.length) return null;
    const repositoryCanonical = new Map(repositoryCanonicalLessons().map((lesson) => [lesson.id.toUpperCase(), lesson]));
    const byId = new Map<string, PublishedLessonRecord>();
    // Atomic storage is an enhancement over the committed curriculum, never a
    // prerequisite for serving it. Bound remote GitHub reads to avoid API burst
    // limits and fail individual rows open to the repository canonical copy.
    const concurrency = 5;
    for (let offset = 0; offset < lessonIds.length; offset += concurrency) {
      const chunk = lessonIds.slice(offset, offset + concurrency);
      const rows = await Promise.all(chunk.map(async (lessonId) => {
        try { return await readJson<PublishedLessonRecord>(lessonPath(lessonId)); }
        catch { return null; }
      }));
      for (const lesson of rows) {
        if (!lesson?.id || lesson.status !== "active") continue;
        const id = lesson.id.toUpperCase();
        const repository = repositoryCanonical.get(id);
        const atomicIsAuthority =
          lesson.metadata?.[CANONICAL_PUBLICATION_MARKER] === "true";
        byId.set(
          id,
          repository && !atomicIsAuthority
            ? { ...repository, translations: lesson.translations ?? repository.translations }
            : lesson,
        );
      }
    }
    return byId.size ? [...byId.values()] : null;
  } catch (error) {
    console.error("[atomic-published-store] durable curriculum read failed", error);
    // Never take the paying-customer curriculum offline because optional
    // durable publication storage is temporarily unavailable.
    return null;
  }
}
export async function upsertAtomicPublishedLessons(batchId: string, lessons: PublishedLessonRecord[]): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") return false;
  if (!lessons.length) return true;
  try {
    const canonicalById = new Map(repositoryCanonicalLessons().map((entry) => [entry.id.toUpperCase(), entry]));
    const prepared = await Promise.all(lessons.map(async (lesson) => {
      const id = lesson.id.toUpperCase();
      const existing = await readJson<PublishedLessonRecord>(lessonPath(id));
      const locale = lesson.frontMatter?.locale?.trim();
      const isLocalized = !isCanonicalLocale(locale);
      let record: PublishedLessonRecord;
      if (isLocalized) {
        const existingIsAuthority = existing?.metadata?.[CANONICAL_PUBLICATION_MARKER] === "true";
        const canonical = (existingIsAuthority ? existing : null) ?? canonicalById.get(id) ?? (existing && !existing.frontMatter?.locale ? existing : null);
        if (!canonical) throw new Error(`Canonical lesson ${id} is unavailable; refusing to publish localized content as the base lesson.`);
        const translations = existing?.translations ?? canonical.translations ?? {};
        record = {
          ...canonical,
          id,
          translations: { ...translations, [locale!]: { title: lesson.title, summary: lesson.summary, body: lesson.body } },
          importedAt: new Date().toISOString(),
        };
      } else {
        const fromPackage = !batchId.startsWith("registry:");
        record = {
          ...lesson, id,
          metadata: { ...(lesson.metadata ?? {}), ...(fromPackage ? { [CANONICAL_PUBLICATION_MARKER]: "true", [CANONICAL_PUBLICATION_BATCH]: batchId } : {}) },
          ...(existing?.translations ? { translations: existing.translations } : {}),
          importedAt: new Date().toISOString(),
        };
      }
      return { id, locale: normalizedLocale(locale), record };
    }));
    // A complete curriculum coordinate is exactly 50 independent lesson keys.
    // Reads above are already concurrent; writes must be concurrent too. Five
    // serial waves of ten writes still exhausted Netlify's request deadline in
    // production recovery. The publication lease prevents competing publishers,
    // and the batch marker below is written only after every lesson write succeeds.
    await Promise.all(prepared.map(({ id, record }) => writeJson(lessonPath(id), record)));
    const entries: AtomicBatchEntry[] = prepared.map(({ id, locale }) => ({ id, locale }));
    await writeJson(batchPath(batchId), { version: 2, entries } satisfies AtomicBatchRecord);
    await updateLessonIndex((indexed) => [...indexed, ...entries.map((entry) => entry.id)]);
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
      lesson = repositoryCanonicalLessons().find((entry) => entry.id.toUpperCase() === id) ?? null;
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
    const record = await readJson<AtomicBatchRecord | string[]>(batchPath(batchId));
    if (!record) return false;
    if (Array.isArray(record)) return false;
    const canonicalById=new Map(repositoryCanonicalLessons().map(l=>[l.id.toUpperCase(),l]));
    for(const entry of record.entries){
      const id=entry.id.toUpperCase(); const existing=await readJson<PublishedLessonRecord>(lessonPath(id)); if(!existing)continue;
      if(!isCanonicalLocale(entry.locale)){
        const translations={...(existing.translations??{})};
        for(const key of Object.keys(translations))if(normalizedLocale(key)===normalizedLocale(entry.locale))delete translations[key];
        const canonical=canonicalById.get(id);
        await writeJson(lessonPath(id),canonical?{...canonical,translations}:{...existing,translations});
      }else{
        const canonical=canonicalById.get(id);
        if(canonical)await writeJson(lessonPath(id),{...canonical,translations:existing.translations??canonical.translations});
      }
    }
    await getAdminContentStorage().deleteBinary(batchPath(batchId));
    return true;
  } catch { return false; }
}

export async function removeAtomicPublishedLesson(lessonId: string): Promise<boolean | null> {
  if (process.env.NODE_ENV !== "production") return null;
  try {
    const path = lessonPath(lessonId);
    if (!await getAdminContentStorage().readBinary(path)) return false;
    const canonical = repositoryCanonicalLessons().find((entry) => entry.id.toUpperCase() === lessonId.toUpperCase());
    if (canonical) await writeJson(path, canonical);
    else await getAdminContentStorage().deleteBinary(path);
    if (!canonical) await updateLessonIndex((indexed) => indexed.filter((id) => id.toUpperCase() !== lessonId.toUpperCase()));
    return true;
  } catch { return null; }
}
