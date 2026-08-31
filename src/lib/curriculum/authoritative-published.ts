import { Buffer } from "node:buffer";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { ExtractedFile, UploadBatch } from "@/lib/admin-content/types";
import { detectBundledCurriculumLessons, detectCurriculumAsset } from "@/lib/admin-content/curriculum";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import { ACADEMIES, ACADEMY_MAP } from "@/lib/curriculum/academies";
import {
  getLocalizedLessonDescription,
  getLocalizedLessonTitle,
  getLocalizedTrackCopy,
  resolveCurriculumLocale,
  type CurriculumLocale,
} from "@/lib/curriculum/localization";
import {
  getLessonContent,
  readRegistry,
  type RegistryAsset,
} from "@/lib/curriculum/reader";

const PUBLISHED_STATE_PATH = "published/curriculum-state.json";
const SEEDS_DIR = join(process.cwd(), "curriculum", "seeds", "translations");
const COURSE_CONTENT_DIR = join(process.cwd(), "content", "courses");

export interface PublishedLessonTranslation {
  title?: string;
  summary?: string;
  body?: string;
}

export interface PublishedLessonRecord {
  id: string;
  track: string;
  trackName: string;
  level: number;
  lessonNumber: number;
  title: string;
  summary: string;
  author: string;
  date: string;
  version: string;
  status: "active";
  importedAt: string;
  metadata: Record<string, string>;
  path: string;
  body: string;
  frontMatter: Record<string, string>;
  translations?: Record<string, PublishedLessonTranslation>;
}

export interface PublishedCurriculumState {
  schemaVersion: "1.0";
  initialized: boolean;
  updatedAt: string;
  lessons: Record<string, PublishedLessonRecord>;
  batchLessonIds: Record<string, string[]>;
}

export interface PublishedLevelSummary {
  level: number;
  lessonCount: number;
  lessons: PublishedLessonRecord[];
}

export interface PublishedTrackSummary {
  code: string;
  name: string;
  description: string;
  levelCount: number;
  lessonCount: number;
  levels: PublishedLevelSummary[];
}

export interface PublishedCourse {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  color: string;
  isFree: boolean;
  isFeatured: boolean;
  lessons: PublishedLessonRecord[];
}

export interface PublishedLessonTranslationImportRecord {
  lessonId: string;
  locale: string;
  title?: string;
  summary?: string;
  body?: string;
}

export interface PublishedLessonTranslationImportResult {
  updatedRecords: number;
  updatedLessonIds: string[];
  missingLessonIds: string[];
}

export interface PublishedLessonTranslationExportRecord {
  id: string;
  title: string;
  summary: string;
  body: string;
}

export interface PublishedLessonTranslationExportOptions {
  prefixes?: string[];
  lessonIds?: string[];
}

function createEmptyState(): PublishedCurriculumState {
  return {
    schemaVersion: "1.0",
    initialized: true,
    updatedAt: new Date().toISOString(),
    lessons: {},
    batchLessonIds: {},
  };
}

async function readPublishedState(): Promise<PublishedCurriculumState> {
  const storage = getAdminContentStorage();
  const buffer = await storage.readBinary(PUBLISHED_STATE_PATH);
  if (!buffer) return createEmptyState();

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
    return createEmptyState();
  }
}

async function writePublishedState(state: PublishedCurriculumState): Promise<void> {
  const storage = getAdminContentStorage();
  const payload = Buffer.from(`${JSON.stringify(state, null, 2)}\n`, "utf8");
  await storage.saveBinary(PUBLISHED_STATE_PATH, payload, "application/json");
}

function parseFrontMatter(raw: string): { frontMatter: Record<string, string>; body: string } {
  if (!raw.startsWith("---")) {
    return { frontMatter: {}, body: raw.trim() };
  }
  const parts = raw.split("---");
  if (parts.length < 3) {
    return { frontMatter: {}, body: raw.trim() };
  }
  const fmText = parts[1] ?? "";
  const body = parts.slice(2).join("---").trim();
  const frontMatter: Record<string, string> = {};
  for (const line of fmText.split(/\r?\n/u)) {
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!key) continue;
    frontMatter[key] = value;
  }
  return { frontMatter, body };
}

function normalizeTrackName(track: string, fallback: string): string {
  const localized = getLocalizedTrackCopy(track, "en");
  if (localized?.name) return localized.name;
  return fallback || ACADEMY_MAP.get(track)?.name || track;
}

function entryFromRegistryAsset(asset: RegistryAsset): PublishedLessonRecord | null {
  if (asset.type !== "lesson" || asset.status !== "active" || typeof asset.lessonNumber !== "number") {
    return null;
  }

  const content = getLessonContent(asset.id, "en");
  if (content) {
    return {
      id: asset.id,
      track: asset.track,
      trackName: normalizeTrackName(asset.track, asset.trackName),
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
    trackName: normalizeTrackName(asset.track, asset.trackName),
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

let _seedTranslationCache: Map<string, PublishedLessonTranslation> | null = null;

function addTranslationToMap(
  map: Map<string, PublishedLessonTranslation>,
  lessonId: string,
  locale: string,
  translation: PublishedLessonTranslation,
): void {
  const normalizedLessonId = lessonId.trim().toUpperCase();
  const normalizedLocale = locale.trim();
  if (!normalizedLessonId || !normalizedLocale) return;
  const key = `${normalizedLessonId}::${normalizedLocale}`;
  const existing = map.get(key);
  if (!existing) {
    map.set(key, translation);
    return;
  }

  map.set(key, {
    title: translation.title || existing.title,
    summary: translation.summary || existing.summary,
    body: translation.body || existing.body,
  });
}

const LEGACY_TRANSLATION_SECTION_TITLES: Record<string, string> = {
  objectives: "Objetivos de aprendizaje",
  topics: "Contenido principal",
  definitions: "Definiciones",
  examples: "Ejemplos prácticos",
  mistakes: "Errores comunes",
  faq: "Preguntas frecuentes",
  takeaways: "Puntos clave",
  exercise: "Ejercicio",
};

function formatLegacyKey(key: string): string {
  return key
    .replace(/[_-]+/gu, " ")
    .replace(/\b\w/gu, (letter) => letter.toUpperCase());
}

function renderLegacyValue(value: unknown, depth = 3): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string" || typeof item === "number" || typeof item === "boolean") {
          return `- ${String(item).trim()}`;
        }
        return renderLegacyValue(item, depth);
      })
      .filter(Boolean)
      .join("\n\n");
  }
  if (!value || typeof value !== "object") return "";

  const headingDepth = Math.min(Math.max(depth, 1), 6);
  return Object.entries(value as Record<string, unknown>)
    .map(([key, nested]) => {
      const rendered = renderLegacyValue(nested, headingDepth + 1);
      if (!rendered) return "";
      if (typeof nested === "string" || typeof nested === "number" || typeof nested === "boolean") {
        return `**${formatLegacyKey(key)}:** ${rendered}`;
      }
      return `${"#".repeat(headingDepth)} ${formatLegacyKey(key)}\n\n${rendered}`;
    })
    .filter(Boolean)
    .join("\n\n");
}

function renderLegacyStructuredBody(record: Record<string, unknown>): string | undefined {
  const sections = Object.entries(LEGACY_TRANSLATION_SECTION_TITLES)
    .map(([key, title]) => {
      const rendered = renderLegacyValue(record[key]);
      return rendered ? `## ${title}\n\n${rendered}` : "";
    })
    .filter(Boolean);
  return sections.length > 0 ? sections.join("\n\n") : undefined;
}

function normalizeBundledTranslation(raw: unknown): PublishedLessonTranslation | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  const title = typeof record.title === "string" ? record.title.trim() : undefined;
  const summaryValue = typeof record.summary === "string"
    ? record.summary
    : typeof record.exec_summary === "string"
      ? record.exec_summary
      : undefined;
  const summary = summaryValue?.trim();
  const canonicalBody = typeof record.body === "string" ? record.body.trim() : undefined;
  const body = canonicalBody || renderLegacyStructuredBody(record);

  if (!title && !summary && !body) return null;
  return {
    ...(title ? { title } : {}),
    ...(summary ? { summary } : {}),
    ...(body ? { body } : {}),
  };
}

function loadBundledTranslationRecord(
  rawRecord: unknown,
  map: Map<string, PublishedLessonTranslation>,
): void {
  if (!rawRecord || typeof rawRecord !== "object" || Array.isArray(rawRecord)) return;
  const record = rawRecord as Record<string, unknown>;
  const lessonId = typeof record.id === "string"
    ? record.id
    : typeof record.lesson_id === "string"
      ? record.lesson_id
      : typeof record.lessonId === "string"
        ? record.lessonId
        : "";
  const translations = record.translations;
  if (!lessonId || !translations || typeof translations !== "object" || Array.isArray(translations)) {
    return;
  }

  for (const [locale, rawTranslation] of Object.entries(translations as Record<string, unknown>)) {
    const translation = normalizeBundledTranslation(rawTranslation);
    if (!translation) continue;
    addTranslationToMap(map, lessonId, locale, translation);
  }
}

function loadBundledTranslationFiles(
  dir: string,
  map: Map<string, PublishedLessonTranslation>,
): void {
  if (!existsSync(dir)) return;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      loadBundledTranslationFiles(path, map);
      continue;
    }

    if (!entry.name.endsWith(".json")) continue;

    try {
      const parsed = JSON.parse(readFileSync(path, "utf8")) as unknown;
      const candidateRecords = Array.isArray(parsed)
        ? parsed
        : parsed && typeof parsed === "object" && Array.isArray((parsed as Record<string, unknown>).records)
          ? (parsed as { records: unknown[] }).records
          : [parsed];

      for (const candidate of candidateRecords) {
        loadBundledTranslationRecord(candidate, map);
      }
    } catch {
      // Ignore malformed/unrelated JSON artifacts; they should not break curriculum rendering.
    }
  }
}

function loadSeedTranslations(): Map<string, PublishedLessonTranslation> {
  if (_seedTranslationCache) return _seedTranslationCache;
  const map = new Map<string, PublishedLessonTranslation>();

  if (existsSync(SEEDS_DIR)) {
    for (const file of readdirSync(SEEDS_DIR)) {
      if (!file.endsWith(".json")) continue;
      try {
        const content = readFileSync(join(SEEDS_DIR, file), "utf8");
        const records = JSON.parse(content) as PublishedLessonTranslationImportRecord[];
        if (!Array.isArray(records)) continue;
        for (const record of records) {
          if (typeof record.lessonId === "string" && typeof record.locale === "string") {
            addTranslationToMap(map, record.lessonId, record.locale, {
              ...(typeof record.title === "string" ? { title: record.title } : {}),
              ...(typeof record.summary === "string" ? { summary: record.summary } : {}),
              ...(typeof record.body === "string" ? { body: record.body } : {}),
            });
          }
        }
      } catch {
        // skip malformed seed files
      }
    }
  }

  loadBundledTranslationFiles(COURSE_CONTENT_DIR, map);

  _seedTranslationCache = map;
  return map;
}

function resolveSeedTranslation(
  lessonId: string,
  locale: CurriculumLocale,
): PublishedLessonTranslation | undefined {
  const seeds = loadSeedTranslations();
  const normalizedLessonId = lessonId.toUpperCase();
  const exact = seeds.get(`${normalizedLessonId}::${locale}`);
  if (exact) return exact;

  const base = locale.split("-")[0];
  if (base) {
    const baseMatch = seeds.get(`${normalizedLessonId}::${base}`);
    if (baseMatch) return baseMatch;

    for (const [key, translation] of seeds) {
      if (!key.startsWith(`${normalizedLessonId}::`)) continue;
      const candidateLocale = key.slice(key.indexOf("::") + 2);
      if (candidateLocale.split("-")[0] === base) return translation;
    }
  }
  return undefined;
}

function resolveTranslation(
  translations: Record<string, PublishedLessonTranslation> | undefined,
  locale: CurriculumLocale,
): PublishedLessonTranslation | undefined {
  if (!translations) return undefined;
  if (translations[locale]) return translations[locale];
  const base = locale.split("-")[0];
  if (base && translations[base]) return translations[base];
  if (base) {
    const regionalKey = Object.keys(translations).find(
      (candidate) => candidate.split("-")[0] === base,
    );
    if (regionalKey) return translations[regionalKey];
  }
  return undefined;
}

function resolvePublishedLessonForLocale(
  lesson: PublishedLessonRecord,
  locale: CurriculumLocale,
): PublishedLessonRecord {
  const localizedContent = getLessonContent(lesson.id, locale);
  const contentMatchesLocale =
    localizedContent && localizedContent.localization.resolution !== "canonical-en";
  if (contentMatchesLocale) {
    return {
      ...lesson,
      title: localizedContent.meta.title,
      summary: localizedContent.meta.summary,
      body: localizedContent.body,
    };
  }

  const storedTranslation = resolveTranslation(lesson.translations, locale);
  const committedTranslation = resolveSeedTranslation(lesson.id, locale);

  const translation: PublishedLessonTranslation | undefined =
    storedTranslation || committedTranslation
      ? {
          title: storedTranslation?.title ?? committedTranslation?.title,
          summary: storedTranslation?.summary ?? committedTranslation?.summary,
          body: storedTranslation?.body ?? committedTranslation?.body,
        }
      : undefined;

  return {
    ...lesson,
    title: translation?.title ?? getLocalizedLessonTitle(lesson.id, locale, lesson.title),
    summary: translation?.summary ?? getLocalizedLessonDescription(lesson.id, locale, lesson.summary),
    body: translation?.body ?? lesson.body,
  };
}

function sortLessons(lessons: PublishedLessonRecord[]): PublishedLessonRecord[] {
  return [...lessons].sort((a, b) => {
    return a.track.localeCompare(b.track)
      || a.level - b.level
      || a.lessonNumber - b.lessonNumber
      || a.id.localeCompare(b.id);
  });
}

const RED_LEVEL2_ALWAYS_FALLBACK = new Set(["RED-L2-001", "RED-L2-002"]);

async function getEffectiveState(): Promise<PublishedCurriculumState> {
  const state = await readPublishedState();

  const registry = readRegistry();
  const allowLegacyFallback =
    process.env.EDUNANCIAL_ENABLE_LEGACY_CURRICULUM_REGISTRY_FALLBACK === "true";

  for (const track of Object.values(registry.tracks)) {
    for (const level of Object.values(track.levels)) {
      for (const asset of Object.values(level.assets)) {
        if (state.lessons[asset.id]) continue;
        if (!allowLegacyFallback && !RED_LEVEL2_ALWAYS_FALLBACK.has(asset.id)) continue;

        const record = entryFromRegistryAsset(asset);
        if (record) state.lessons[record.id] = record;
      }
    }
  }

  return state;
}

function lessonFromDetectedAsset(
  asset: Awaited<ReturnType<typeof detectCurriculumAsset>>,
  raw: string,
): PublishedLessonRecord | null {
  if (!asset || asset.type !== "lesson") return null;
  if (!asset.id || !asset.track || !asset.level || !asset.number) return null;

  const parsed = parseFrontMatter(raw);
  return {
    id: asset.id,
    track: asset.track,
    trackName: normalizeTrackName(asset.track, asset.trackName),
    level: asset.level,
    lessonNumber: asset.number,
    title: parsed.frontMatter.title ?? asset.id,
    summary: parsed.frontMatter.summary ?? "",
    author: parsed.frontMatter.author ?? "Edunancial Faculty",
    date: parsed.frontMatter.date ?? new Date().toISOString().slice(0, 10),
    version: parsed.frontMatter.version ?? "1.0",
    status: "active",
    importedAt: new Date().toISOString(),
    metadata: {
      officialTrackName: parsed.frontMatter.officialTrackName ?? asset.trackName,
    },
    path: asset.canonicalPath,
    body: parsed.body,
    frontMatter: parsed.frontMatter,
  };
}

async function extractLessonsFromFile(file: ExtractedFile): Promise<PublishedLessonRecord[]> {
  if (file.extension !== ".md") return [];
  const raw = Buffer.from(file.encodedContent, "base64").toString("utf8");

  const direct = await detectCurriculumAsset(raw, file.originalFilename);
  if (direct && !direct.locale) {
    const lesson = lessonFromDetectedAsset(direct, raw);
    return lesson ? [lesson] : [];
  }

  const bundled = await detectBundledCurriculumLessons(raw);
  if (bundled.length === 0) return [];

  return bundled
    .map(({ asset, content }) => lessonFromDetectedAsset(asset, content))
    .filter((entry): entry is PublishedLessonRecord => Boolean(entry));
}

export async function upsertPublishedLessonsFromBatch(batch: UploadBatch): Promise<{ upserted: number }> {
  const approvedFiles = batch.files.filter((file) => file.reviewStatus === "approved");
  if (approvedFiles.length === 0) return { upserted: 0 };

  const lessonsFromBatch = (await Promise.all(approvedFiles.map((file) => extractLessonsFromFile(file)))).flat();
  if (lessonsFromBatch.length === 0) return { upserted: 0 };

  const state = await readPublishedState();
  const lessonIds = new Set<string>();

  for (const lesson of lessonsFromBatch) {
    for (const [existingBatchId, existingLessonIds] of Object.entries(state.batchLessonIds)) {
      if (!existingLessonIds.includes(lesson.id)) continue;
      state.batchLessonIds[existingBatchId] = existingLessonIds.filter((id) => id !== lesson.id);
    }

    const existingTranslations = state.lessons[lesson.id]?.translations;
    state.lessons[lesson.id] = {
      ...lesson,
      ...(existingTranslations ? { translations: existingTranslations } : {}),
      importedAt: new Date().toISOString(),
    };
    lessonIds.add(lesson.id);
  }

  state.batchLessonIds[batch.id] = sortLessons(lessonsFromBatch).map((lesson) => lesson.id);
  state.updatedAt = new Date().toISOString();
  await writePublishedState(state);
  return { upserted: lessonIds.size };
}

export async function importPublishedLessonTranslations(
  records: PublishedLessonTranslationImportRecord[],
): Promise<PublishedLessonTranslationImportResult> {
  if (records.length === 0) return { updatedRecords: 0, updatedLessonIds: [], missingLessonIds: [] };

  const state = await readPublishedState();
  const missingLessonIds = [...new Set(
    records.map((record) => record.lessonId.trim().toUpperCase()).filter((lessonId) => !state.lessons[lessonId]),
  )];
  const missing = new Set(missingLessonIds);

  const updatedLessonIds = new Set<string>();
  let updatedRecords = 0;
  for (const record of records) {
    const lessonId = record.lessonId.trim().toUpperCase();
    if (missing.has(lessonId)) continue;

    const locale = record.locale.trim();
    const lesson = state.lessons[lessonId];
    const existingTranslations = lesson.translations ?? {};
    const currentLocaleTranslation = existingTranslations[locale] ?? {};
    const nextLocaleTranslation: PublishedLessonTranslation = { ...currentLocaleTranslation };

    if (typeof record.title === "string") nextLocaleTranslation.title = record.title;
    if (typeof record.summary === "string") nextLocaleTranslation.summary = record.summary;
    if (typeof record.body === "string") nextLocaleTranslation.body = record.body;

    state.lessons[lessonId] = {
      ...lesson,
      translations: { ...existingTranslations, [locale]: nextLocaleTranslation },
    };
    updatedLessonIds.add(lessonId);
    updatedRecords += 1;
  }

  if (updatedRecords > 0) {
    state.updatedAt = new Date().toISOString();
    await writePublishedState(state);
  }

  return {
    updatedRecords,
    updatedLessonIds: [...updatedLessonIds].sort(),
    missingLessonIds,
  };
}

export async function exportPublishedLessonTranslations(
  options: PublishedLessonTranslationExportOptions = {},
): Promise<(PublishedLessonTranslationExportRecord | { id: string; title: null; summary: null; body: null })[]> {
  const prefixes = options.prefixes?.map((p) => p.trim().toUpperCase()).filter(Boolean);
  const lessonIds = options.lessonIds?.map((lessonId) => lessonId.trim().toUpperCase()).filter(Boolean);
  const requestedLessonIds = lessonIds && lessonIds.length > 0 ? new Set(lessonIds) : null;
  const state = await getEffectiveState();

  function matchesPrefix(id: string): boolean {
    if (!prefixes || prefixes.length === 0) return true;
    return prefixes.some((p) => {
      if (/^L[1-9]\d*$/u.test(p)) {
        const parts = id.split("-");
        return parts.length === 3 && parts[1] === p;
      }
      return id.startsWith(`${p}-`);
    });
  }

  const matched = sortLessons(Object.values(state.lessons).filter((lesson) => {
    if (lesson.status !== "active") return false;
    if (requestedLessonIds && !requestedLessonIds.has(lesson.id)) return false;
    if (!matchesPrefix(lesson.id)) return false;
    return true;
  })).map((lesson) => ({ id: lesson.id, title: lesson.title, summary: lesson.summary, body: lesson.body }));

  if (requestedLessonIds) {
    const foundIds = new Set(matched.map((r) => r.id));
    const nullPlaceholders = [...requestedLessonIds]
      .filter((id) => !foundIds.has(id))
      .map((id) => ({ id, title: null, summary: null, body: null }));
    return [...matched, ...nullPlaceholders];
  }

  return matched;
}

export async function removePublishedLessonsForBatch(
  batch: UploadBatch,
): Promise<{ removed: number; trackedLessonIds: string[] }> {
  const state = await readPublishedState();
  const trackedLessonIds = state.batchLessonIds[batch.id] ?? [];
  let targetIds = [...trackedLessonIds];

  if (targetIds.length === 0) {
    const detected = (await Promise.all(batch.files.map((file) => extractLessonsFromFile(file)))).flat().map((lesson) => lesson.id);
    targetIds = [...new Set(detected)];
  }

  if (!state.initialized) state.initialized = true;
  for (const lessonId of targetIds) delete state.lessons[lessonId];

  delete state.batchLessonIds[batch.id];
  state.updatedAt = new Date().toISOString();
  await writePublishedState(state);

  return { removed: targetIds.length, trackedLessonIds: targetIds };
}

export async function getPublishedTracks(languageOrLocale: string): Promise<PublishedTrackSummary[]> {
  const locale = resolveCurriculumLocale(languageOrLocale);
  const state = await getEffectiveState();

  const lessonsByTrackLevel = new Map<string, Map<number, PublishedLessonRecord[]>>();
  for (const lesson of Object.values(state.lessons)) {
    if (lesson.status !== "active") continue;
    const byLevel = lessonsByTrackLevel.get(lesson.track) ?? new Map<number, PublishedLessonRecord[]>();
    const list = byLevel.get(lesson.level) ?? [];
    list.push(lesson);
    byLevel.set(lesson.level, list);
    lessonsByTrackLevel.set(lesson.track, byLevel);
  }

  const tracks: PublishedTrackSummary[] = [];
  for (const academy of ACADEMIES) {
    const byLevel = lessonsByTrackLevel.get(academy.code);
    const localizedTrack = getLocalizedTrackCopy(academy.code, locale);
    const levels = Array.from({ length: academy.levelCount }, (_, index) => index + 1).map((level) => {
      const lessons = byLevel?.get(level) ?? [];
      return {
        level,
        lessonCount: lessons.length,
        lessons: sortLessons(lessons).map((lesson) => ({
          ...resolvePublishedLessonForLocale(lesson, locale),
          trackName: localizedTrack?.name ?? lesson.trackName,
        })),
      };
    });

    const lessonCount = levels.reduce((sum, level) => sum + level.lessonCount, 0);
    tracks.push({
      code: academy.code,
      name: localizedTrack?.name ?? academy.name,
      description: localizedTrack?.description ?? academy.description,
      levelCount: academy.levelCount,
      lessonCount,
      levels,
    });
  }

  return tracks.sort((a, b) => ACADEMIES.findIndex((x) => x.code === a.code) - ACADEMIES.findIndex((x) => x.code === b.code));
}

export async function getPublishedTrack(
  trackCode: string,
  languageOrLocale: string,
): Promise<PublishedTrackSummary | null> {
  const normalized = trackCode.toUpperCase();
  const tracks = await getPublishedTracks(languageOrLocale);
  return tracks.find((track) => track.code === normalized) ?? null;
}

export async function getPublishedLesson(
  lessonId: string,
  languageOrLocale: string,
): Promise<PublishedLessonRecord | null> {
  const locale: CurriculumLocale = resolveCurriculumLocale(languageOrLocale);
  const state = await getEffectiveState();
  const lesson = state.lessons[lessonId.toUpperCase()];
  if (!lesson || lesson.status !== "active") return null;
  return resolvePublishedLessonForLocale(lesson, locale);
}

export async function removePublishedLesson(lessonId: string): Promise<boolean> {
  const normalizedLessonId = lessonId.toUpperCase();
  const state = await readPublishedState();
  const exists = Boolean(state.lessons[normalizedLessonId]);
  if (!exists) return false;

  delete state.lessons[normalizedLessonId];
  for (const [batchId, lessonIds] of Object.entries(state.batchLessonIds)) {
    state.batchLessonIds[batchId] = lessonIds.filter((id) => id !== normalizedLessonId);
  }
  state.updatedAt = new Date().toISOString();
  await writePublishedState(state);
  return true;
}

export async function upsertPublishedLessonFromRegistry(lessonId: string): Promise<boolean> {
  const normalizedLessonId = lessonId.toUpperCase();
  const registry = readRegistry();
  let lessonAsset: RegistryAsset | null = null;

  for (const track of Object.values(registry.tracks)) {
    for (const level of Object.values(track.levels)) {
      const candidate = level.assets[normalizedLessonId];
      if (candidate?.type === "lesson") {
        lessonAsset = candidate;
        break;
      }
    }
    if (lessonAsset) break;
  }

  if (!lessonAsset) return false;
  const nextRecord = entryFromRegistryAsset(lessonAsset);
  if (!nextRecord) return false;

  const state = await readPublishedState();
  const existingTranslations = state.lessons[normalizedLessonId]?.translations;
  state.lessons[normalizedLessonId] = {
    ...nextRecord,
    ...(existingTranslations ? { translations: existingTranslations } : {}),
    importedAt: new Date().toISOString(),
  };
  state.updatedAt = new Date().toISOString();
  await writePublishedState(state);
  return true;
}

export async function getPublishedCourses(languageOrLocale: string): Promise<PublishedCourse[]> {
  const tracks = await getPublishedTracks(languageOrLocale);
  const colors: Record<string, string> = {
    RED: "bg-red-700",
    WHITE: "bg-slate-200",
    BLUE: "bg-blue-700",
    GREEN: "bg-green-700",
    GOLD: "bg-yellow-600",
    PURPLE: "bg-purple-700",
    ORANGE: "bg-orange-700",
    BLACK: "bg-slate-700",
  };

  return tracks.map((track) => ({
    id: track.code.toLowerCase(),
    code: track.code,
    title: `${track.code}: ${track.name}`,
    subtitle: track.description,
    description: track.description,
    category: track.name,
    difficulty: "Intermediate" as const,
    color: colors[track.code] ?? "bg-slate-700",
    isFree: false,
    isFeatured: false,
    lessons: track.levels.flatMap((level) => level.lessons),
  }));
}
