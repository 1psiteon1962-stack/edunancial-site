import {
  getPublishedTracks,
  type PublishedLessonRecord,
} from "@/lib/curriculum/authoritative-published";
import {
  CURRICULUM_TRANSLATION_TARGET_LOCALES,
  PUBLIC_CURRICULUM_TRACK_CODES,
} from "@/lib/curriculum/localization";
import { getBaseLanguageCode } from "@/lib/international/languages";

export interface TranslationLocaleReadiness {
  locale: string;
  translatedBodies: number;
  totalLessons: number;
  complete: boolean;
  missingLessonIds: string[];
}

export interface TranslationTrackReadiness {
  track: string;
  canonicalLessons: number;
  canonicalComplete: boolean;
  locales: TranslationLocaleReadiness[];
  allLanguagesComplete: boolean;
}

export interface CurriculumTranslationReadinessReport {
  level: number;
  expectedLessonsPerTrack: number;
  generatedAt: string;
  targetLocales: string[];
  tracks: TranslationTrackReadiness[];
}

function byId(lessons: PublishedLessonRecord[]): Map<string, PublishedLessonRecord> {
  return new Map(lessons.map((lesson) => [lesson.id, lesson]));
}

function hasTranslatedBody(
  canonical: PublishedLessonRecord,
  localized: PublishedLessonRecord | undefined,
): boolean {
  if (!localized?.body?.trim()) return false;
  return localized.body.trim() !== canonical.body.trim();
}

/**
 * Measures whether the actual lesson body is translated. UI chrome, academy
 * names, titles, and summaries do not count as a completed lesson translation.
 * English variants are represented by the canonical English curriculum and are
 * therefore not counted as translation targets.
 */
export async function getCurriculumTranslationReadiness(
  level = 1,
  expectedLessonsPerTrack = 50,
): Promise<CurriculumTranslationReadinessReport> {
  const targetLocales = Array.from(
    new Set(CURRICULUM_TRANSLATION_TARGET_LOCALES.filter((locale) => getBaseLanguageCode(locale) !== "en")),
  );

  const englishTracks = await getPublishedTracks("en");
  const localizedTracksByLocale = new Map<string, Awaited<ReturnType<typeof getPublishedTracks>>>();

  await Promise.all(
    targetLocales.map(async (locale) => {
      localizedTracksByLocale.set(locale, await getPublishedTracks(locale));
    }),
  );

  const tracks = PUBLIC_CURRICULUM_TRACK_CODES.map((trackCode) => {
    const englishTrack = englishTracks.find((track) => track.code === trackCode);
    const canonicalLessons = (englishTrack?.levels ?? [])
      .find((entry) => entry.level === level)?.lessons ?? [];

    const locales = targetLocales.map((locale) => {
      const localizedTrack = localizedTracksByLocale
        .get(locale)
        ?.find((track) => track.code === trackCode);
      const localizedLessons = (localizedTrack?.levels ?? [])
        .find((entry) => entry.level === level)?.lessons ?? [];
      const localizedById = byId(localizedLessons);

      const missingLessonIds = canonicalLessons
        .filter((canonical) => !hasTranslatedBody(canonical, localizedById.get(canonical.id)))
        .map((lesson) => lesson.id);

      return {
        locale,
        translatedBodies: canonicalLessons.length - missingLessonIds.length,
        totalLessons: canonicalLessons.length,
        complete:
          canonicalLessons.length === expectedLessonsPerTrack
          && missingLessonIds.length === 0,
        missingLessonIds,
      } satisfies TranslationLocaleReadiness;
    });

    return {
      track: trackCode,
      canonicalLessons: canonicalLessons.length,
      canonicalComplete: canonicalLessons.length === expectedLessonsPerTrack,
      locales,
      allLanguagesComplete:
        canonicalLessons.length === expectedLessonsPerTrack
        && locales.every((locale) => locale.complete),
    } satisfies TranslationTrackReadiness;
  });

  return {
    level,
    expectedLessonsPerTrack,
    generatedAt: new Date().toISOString(),
    targetLocales,
    tracks,
  };
}
