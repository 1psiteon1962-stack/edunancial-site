import { Buffer } from "node:buffer";

import { getAdminContentStorage } from "@/lib/admin-content/storage";

const PUBLISHED_STATE_PATH = "published/curriculum-state.json";

interface StoredLessonRecord {
  id?: string;
  translations?: Record<string, unknown>;
  [key: string]: unknown;
}

interface StoredPublishedState {
  updatedAt?: string;
  lessons?: Record<string, StoredLessonRecord>;
  [key: string]: unknown;
}

export interface ClearPublishedTranslationsOptions {
  locale: string;
  lessonIds?: string[];
  lessonPrefix?: string;
}

export interface ClearPublishedTranslationsResult {
  locale: string;
  matchedLessons: number;
  clearedTranslations: number;
  lessonIds: string[];
}

export async function clearPublishedTranslations(
  options: ClearPublishedTranslationsOptions,
): Promise<ClearPublishedTranslationsResult> {
  const locale = options.locale.trim();
  if (!locale) throw new Error("locale is required");

  const explicitIds = new Set(
    (options.lessonIds ?? []).map((id) => id.trim().toUpperCase()).filter(Boolean),
  );
  const prefix = options.lessonPrefix?.trim().toUpperCase() ?? "";
  if (explicitIds.size === 0 && !prefix) {
    throw new Error("At least one lessonId or lessonPrefix is required");
  }

  const storage = getAdminContentStorage();
  const buffer = await storage.readBinary(PUBLISHED_STATE_PATH);
  if (!buffer) {
    return { locale, matchedLessons: 0, clearedTranslations: 0, lessonIds: [] };
  }

  const state = JSON.parse(buffer.toString("utf8")) as StoredPublishedState;
  const lessons = state.lessons ?? {};
  const clearedLessonIds: string[] = [];
  let matchedLessons = 0;

  for (const [rawLessonId, lesson] of Object.entries(lessons)) {
    const lessonId = rawLessonId.toUpperCase();
    const matches = explicitIds.has(lessonId) || Boolean(prefix && lessonId.startsWith(prefix));
    if (!matches) continue;
    matchedLessons += 1;

    if (!lesson.translations || !(locale in lesson.translations)) continue;
    const nextTranslations = { ...lesson.translations };
    delete nextTranslations[locale];
    lesson.translations = nextTranslations;
    clearedLessonIds.push(lessonId);
  }

  if (clearedLessonIds.length > 0) {
    state.updatedAt = new Date().toISOString();
    await storage.saveBinary(
      PUBLISHED_STATE_PATH,
      Buffer.from(`${JSON.stringify(state, null, 2)}\n`, "utf8"),
      "application/json",
    );
  }

  return {
    locale,
    matchedLessons,
    clearedTranslations: clearedLessonIds.length,
    lessonIds: clearedLessonIds.sort(),
  };
}
