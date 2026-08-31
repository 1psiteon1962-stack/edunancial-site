import { Buffer } from "node:buffer";

import { extractLocalizedLessonTranslation } from "@/lib/admin-content/localized-batch-repair";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import {
  exportPublishedLessonTranslations,
  getPublishedLesson,
  getPublishedTrack,
  importPublishedLessonTranslations,
  type PublishedLessonRecord,
  type PublishedLessonTranslation,
  type PublishedLessonTranslationImportRecord,
  type PublishedTrackSummary,
} from "@/lib/curriculum/authoritative-published";
import {
  getCurriculumLocaleFallbackChain,
  resolveCurriculumLocale,
} from "@/lib/curriculum/localization";

const TRANSLATION_INDEX_PATH = "published/curriculum-translation-index.json";
const INDEX_VERSION = 4;
const REBUILD_CONCURRENCY = 6;

type TranslationIndex = {
  version: number;
  builtAt: string;
  batchCount: number;
  translationCount: number;
  complete: boolean;
  processedBatchIds: string[];
  translations: Record<string, Record<string, PublishedLessonTranslation>>;
};

let cachedIndex: Promise<TranslationIndex> | null = null;

function emptyIndex(): TranslationIndex {
  return {
    version: INDEX_VERSION,
    builtAt: new Date().toISOString(),
    batchCount: 0,
    translationCount: 0,
    complete: false,
    processedBatchIds: [],
    translations: {},
  };
}

function normalizeLocale(locale: string): string { return resolveCurriculumLocale(locale); }

function mergeTranslation(existing: PublishedLessonTranslation | undefined, incoming: PublishedLessonTranslation): PublishedLessonTranslation {
  return { title: existing?.title ?? incoming.title, summary: existing?.summary ?? incoming.summary, body: existing?.body ?? incoming.body };
}

export function addHistoricalTranslation(index: TranslationIndex, lessonId: string, locale: string, translation: PublishedLessonTranslation): void {
  const id = lessonId.trim().toUpperCase();
  const normalizedLocale = normalizeLocale(locale);
  if (!id || !normalizedLocale || normalizedLocale === "en-US" || normalizedLocale === "en") return;
  const byLocale = index.translations[id] ?? {};
  byLocale[normalizedLocale] = mergeTranslation(byLocale[normalizedLocale], translation);
  index.translations[id] = byLocale;
}

export function resolveHistoricalTranslation(index: TranslationIndex, lessonId: string, locale: string): PublishedLessonTranslation | undefined {
  const byLocale = index.translations[lessonId.trim().toUpperCase()];
  if (!byLocale) return undefined;
  for (const candidate of getCurriculumLocaleFallbackChain(locale)) {
    const normalized = normalizeLocale(candidate);
    if (byLocale[normalized]) return byLocale[normalized];
    if (byLocale[candidate]) return byLocale[candidate];
  }
  return undefined;
}

function refreshIndexCounts(index: TranslationIndex): void {
  index.batchCount = index.processedBatchIds.length;
  index.translationCount = Object.values(index.translations)
    .reduce((total, translations) => total + Object.keys(translations).length, 0);
  index.builtAt = new Date().toISOString();
}

async function readSavedIndex(): Promise<TranslationIndex | null> {
  const buffer = await getAdminContentStorage().readBinary(TRANSLATION_INDEX_PATH);
  if (!buffer) return null;
  try {
    const parsed = JSON.parse(buffer.toString("utf8")) as Partial<TranslationIndex>;
    if (parsed.version !== INDEX_VERSION || !parsed.translations) return null;
    return {
      version: INDEX_VERSION,
      builtAt: typeof parsed.builtAt === "string" ? parsed.builtAt : new Date().toISOString(),
      batchCount: typeof parsed.batchCount === "number" ? parsed.batchCount : 0,
      translationCount: typeof parsed.translationCount === "number" ? parsed.translationCount : 0,
      complete: parsed.complete === true,
      processedBatchIds: Array.isArray(parsed.processedBatchIds) ? parsed.processedBatchIds.filter((id): id is string => typeof id === "string") : [],
      translations: parsed.translations,
    };
  } catch { return null; }
}

async function saveIndex(index: TranslationIndex): Promise<void> {
  refreshIndexCounts(index);
  await getAdminContentStorage().saveBinary(
    TRANSLATION_INDEX_PATH,
    Buffer.from(`${JSON.stringify(index)}\n`, "utf8"),
    "application/json",
  );
}

function absorbBatch(index: TranslationIndex, batch: Awaited<ReturnType<ReturnType<typeof getAdminContentStorage>["getBatch"]>>): void {
  if (!batch) return;
  const archiveByUploadId = new Map(batch.uploads.map((upload) => [upload.id, upload.originalFilename]));
  for (const file of batch.files) {
    const candidate = extractLocalizedLessonTranslation(file, archiveByUploadId.get(file.uploadId));
    if (!candidate) continue;
    addHistoricalTranslation(index, candidate.lessonId, candidate.locale, {
      ...(candidate.title ? { title: candidate.title } : {}),
      ...(candidate.summary ? { summary: candidate.summary } : {}),
      body: candidate.body,
    });
  }
}

/**
 * Explicit maintenance operation only. It resumes from the last checkpoint,
 * fetches batches concurrently in small groups, and checkpoints after every
 * group so a serverless interruption never discards completed work.
 */
export async function rebuildHistoricalTranslationIndex(): Promise<TranslationIndex> {
  const storage = getAdminContentStorage();
  const summaries = await storage.listBatches();
  const saved = await readSavedIndex();
  const index = saved ?? emptyIndex();
  const processed = new Set(index.processedBatchIds);
  const pending = summaries.filter((summary) => summary.approvedFiles > 0 && !processed.has(summary.id));

  index.complete = false;
  await saveIndex(index);

  for (let offset = 0; offset < pending.length; offset += REBUILD_CONCURRENCY) {
    const chunk = pending.slice(offset, offset + REBUILD_CONCURRENCY);
    const batches = await Promise.all(chunk.map((summary) => storage.getBatch(summary.id)));

    // Keep listBatches() ordering deterministic even though the storage reads
    // happen in parallel. Newer batches therefore retain precedence.
    for (let indexInChunk = 0; indexInChunk < chunk.length; indexInChunk += 1) {
      const summary = chunk[indexInChunk];
      const batch = batches[indexInChunk];
      absorbBatch(index, batch);
      processed.add(summary.id);
      index.processedBatchIds = [...processed];
    }

    await saveIndex(index);
  }

  index.complete = true;
  await saveIndex(index);
  cachedIndex = Promise.resolve(index);
  return index;
}

/**
 * Normal curriculum requests must never scan upload history. They read the
 * saved index if one exists; otherwise they simply use authoritative published
 * translations and committed translation artifacts.
 */
async function getTranslationIndex(): Promise<TranslationIndex> {
  if (cachedIndex) return cachedIndex;
  cachedIndex = (async () => (await readSavedIndex()) ?? emptyIndex())();
  return cachedIndex;
}

export function applyHistoricalTranslation(lesson: PublishedLessonRecord, locale: string, index: TranslationIndex): PublishedLessonRecord {
  const normalizedLocale = normalizeLocale(locale);
  if (normalizedLocale === "en-US" || normalizedLocale === "en") return lesson;
  const translation = resolveHistoricalTranslation(index, lesson.id, normalizedLocale);
  if (!translation) return lesson;
  return { ...lesson, title: translation.title ?? lesson.title, summary: translation.summary ?? lesson.summary, body: translation.body ?? lesson.body };
}

export async function getRuntimePublishedLesson(lessonId: string, languageOrLocale: string): Promise<PublishedLessonRecord | null> {
  const lesson = await getPublishedLesson(lessonId, languageOrLocale);
  if (!lesson) return null;
  const locale = normalizeLocale(languageOrLocale);
  if (locale === "en-US" || locale === "en") return lesson;
  return applyHistoricalTranslation(lesson, locale, await getTranslationIndex());
}

export async function getRuntimePublishedTrack(trackCode: string, languageOrLocale: string): Promise<PublishedTrackSummary | null> {
  const track = await getPublishedTrack(trackCode, languageOrLocale);
  if (!track) return null;
  const locale = normalizeLocale(languageOrLocale);
  if (locale === "en-US" || locale === "en") return track;
  const index = await getTranslationIndex();
  return { ...track, levels: track.levels.map((level) => ({ ...level, lessons: level.lessons.map((lesson) => applyHistoricalTranslation(lesson, locale, index)) })) };
}

export async function reconcilePublishedTranslationsFromHistory(): Promise<{ scannedBatches: number; indexedTranslations: number; importedTranslations: number; skippedMissingCanonicalLessons: number; complete: boolean }> {
  const index = await rebuildHistoricalTranslationIndex();
  const lessonIds = Object.keys(index.translations);
  if (lessonIds.length === 0) {
    return {
      scannedBatches: index.batchCount,
      indexedTranslations: 0,
      importedTranslations: 0,
      skippedMissingCanonicalLessons: 0,
      complete: index.complete,
    };
  }

  const exported = await exportPublishedLessonTranslations({ lessonIds });
  const existingIds = new Set(exported.filter((record) => record.title !== null).map((record) => record.id.toUpperCase()));
  const records: PublishedLessonTranslationImportRecord[] = [];
  let skippedMissingCanonicalLessons = 0;
  for (const [lessonId, translations] of Object.entries(index.translations)) {
    if (!existingIds.has(lessonId)) {
      skippedMissingCanonicalLessons += Object.keys(translations).length;
      continue;
    }
    for (const [locale, translation] of Object.entries(translations)) records.push({ lessonId, locale, ...translation });
  }
  const imported = records.length > 0
    ? await importPublishedLessonTranslations(records)
    : { updatedRecords: 0, updatedLessonIds: [], missingLessonIds: [] };
  return {
    scannedBatches: index.batchCount,
    indexedTranslations: index.translationCount,
    importedTranslations: imported.updatedRecords,
    skippedMissingCanonicalLessons,
    complete: index.complete,
  };
}

export function resetRuntimeTranslationIndexForTests(): void { cachedIndex = null; }
