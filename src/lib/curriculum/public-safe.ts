import { ACADEMIES } from "@/lib/curriculum/academies";
import { getLocalizedTrackCopy, resolveCurriculumLocale } from "@/lib/curriculum/localization";
import { getLessonContent, readRegistry, type RegistryAsset } from "@/lib/curriculum/reader";
import {
  getPublishedLesson as getRemotePublishedLesson,
  getPublishedTrack as getRemotePublishedTrack,
  getPublishedTracks as getRemotePublishedTracks,
  type PublishedLessonRecord,
} from "@/lib/curriculum/authoritative-published";

function registryLesson(asset: RegistryAsset, locale: string): PublishedLessonRecord | null {
  if (asset.type !== "lesson" || asset.status !== "active" || typeof asset.lessonNumber !== "number") return null;
  const content = getLessonContent(asset.id, locale) ?? getLessonContent(asset.id, "en");
  return {
    id: asset.id,
    track: asset.track,
    trackName: asset.trackName,
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
  };
}

function bundledTracks(languageOrLocale: string) {
  const locale = resolveCurriculumLocale(languageOrLocale);
  const registry = readRegistry();
  return ACADEMIES.map((academy) => {
    const localized = getLocalizedTrackCopy(academy.code, locale);
    const registryTrack = registry.tracks[academy.code];
    const levels = Array.from({ length: academy.levelCount }, (_, index) => index + 1).map((level) => {
      const assets = registryTrack?.levels?.[String(level)]?.assets ?? registryTrack?.levels?.[level as unknown as keyof typeof registryTrack.levels]?.assets ?? {};
      const lessons = Object.values(assets)
        .map((asset) => registryLesson(asset, locale))
        .filter((lesson): lesson is PublishedLessonRecord => Boolean(lesson))
        .sort((a, b) => a.lessonNumber - b.lessonNumber || a.id.localeCompare(b.id));
      return { level, lessonCount: lessons.length, lessons };
    });
    return {
      code: academy.code,
      name: localized?.name ?? academy.name,
      description: localized?.description ?? academy.description,
      levelCount: academy.levelCount,
      lessonCount: levels.reduce((sum, level) => sum + level.lessonCount, 0),
      levels,
    };
  });
}

export async function getPublishedTracks(languageOrLocale: string) {
  try { return await getRemotePublishedTracks(languageOrLocale); }
  catch { return bundledTracks(languageOrLocale); }
}

export async function getPublishedTrack(code: string, languageOrLocale: string) {
  try { return await getRemotePublishedTrack(code, languageOrLocale); }
  catch { return bundledTracks(languageOrLocale).find((track) => track.code === code.toUpperCase()) ?? null; }
}

export async function getPublishedLesson(id: string, languageOrLocale: string) {
  try { return await getRemotePublishedLesson(id, languageOrLocale); }
  catch {
    const normalized = id.toUpperCase();
    for (const track of bundledTracks(languageOrLocale)) {
      for (const level of track.levels) {
        const lesson = level.lessons.find((candidate) => candidate.id.toUpperCase() === normalized);
        if (lesson) return lesson;
      }
    }
    return null;
  }
}
