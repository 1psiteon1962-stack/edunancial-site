import { Buffer } from "node:buffer";

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
  if (!content) return null;

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

function sortLessons(lessons: PublishedLessonRecord[]): PublishedLessonRecord[] {
  return [...lessons].sort((a, b) => {
    return a.track.localeCompare(b.track)
      || a.level - b.level
      || a.lessonNumber - b.lessonNumber
      || a.id.localeCompare(b.id);
  });
}

async function getEffectiveState(): Promise<PublishedCurriculumState> {
  return readPublishedState();
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
  if (approvedFiles.length === 0) {
    return { upserted: 0 };
  }

  const lessonsFromBatch = (await Promise.all(approvedFiles.map((file) => extractLessonsFromFile(file))))
    .flat();

  if (lessonsFromBatch.length === 0) {
    return { upserted: 0 };
  }

  const state = await readPublishedState();

  const lessonIds = new Set<string>();

  for (const lesson of lessonsFromBatch) {
    for (const [existingBatchId, existingLessonIds] of Object.entries(state.batchLessonIds)) {
      if (!existingLessonIds.includes(lesson.id)) continue;
      state.batchLessonIds[existingBatchId] = existingLessonIds.filter((id) => id !== lesson.id);
    }

    state.lessons[lesson.id] = {
      ...lesson,
      importedAt: new Date().toISOString(),
    };
    lessonIds.add(lesson.id);
  }

  state.batchLessonIds[batch.id] = sortLessons(lessonsFromBatch).map((lesson) => lesson.id);
  state.updatedAt = new Date().toISOString();

  await writePublishedState(state);
  return { upserted: lessonIds.size };
}

export async function removePublishedLessonsForBatch(
  batch: UploadBatch,
): Promise<{ removed: number; trackedLessonIds: string[] }> {
  const state = await readPublishedState();

  const trackedLessonIds = state.batchLessonIds[batch.id] ?? [];
  let targetIds = [...trackedLessonIds];

  if (targetIds.length === 0) {
    const detected = (await Promise.all(batch.files.map((file) => extractLessonsFromFile(file))))
      .flat()
      .map((lesson) => lesson.id);
    targetIds = [...new Set(detected)];
  }

  if (!state.initialized) {
    state.initialized = true;
  }

  for (const lessonId of targetIds) {
    delete state.lessons[lessonId];
  }

  delete state.batchLessonIds[batch.id];
  state.updatedAt = new Date().toISOString();

  await writePublishedState(state);

  return {
    removed: targetIds.length,
    trackedLessonIds: targetIds,
  };
}

export async function getPublishedTracks(
  languageOrLocale: string,
): Promise<PublishedTrackSummary[]> {
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
    const levels = Array.from({ length: academy.levelCount }, (_, index) => index + 1)
      .map((level) => {
        const lessons = byLevel?.get(level) ?? [];
        return {
          level,
          lessonCount: lessons.length,
          lessons: sortLessons(lessons).map((lesson) => ({
            ...lesson,
            trackName: localizedTrack?.name ?? lesson.trackName,
            title: getLocalizedLessonTitle(lesson.id, locale, lesson.title),
            summary: getLocalizedLessonDescription(lesson.id, locale, lesson.summary),
          })),
        };
      });

    tracks.push({
      code: academy.code,
      name: localizedTrack?.name ?? academy.name,
      description: localizedTrack?.description ?? academy.description,
      levelCount: academy.levelCount,
      lessonCount: levels.reduce((sum, level) => sum + level.lessonCount, 0),
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

  return {
    ...lesson,
    title: getLocalizedLessonTitle(lesson.id, locale, lesson.title),
    summary: getLocalizedLessonDescription(lesson.id, locale, lesson.summary),
  };
}

export async function removePublishedLesson(lessonId: string): Promise<boolean> {
  const normalizedLessonId = lessonId.toUpperCase();
  const state = await readPublishedState();
  const exists = Boolean(state.lessons[normalizedLessonId]);
  if (!exists) {
    return false;
  }

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

  if (!lessonAsset) {
    return false;
  }

  const nextRecord = entryFromRegistryAsset(lessonAsset);
  if (!nextRecord) {
    return false;
  }

  const state = await readPublishedState();
  state.lessons[normalizedLessonId] = {
    ...nextRecord,
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
