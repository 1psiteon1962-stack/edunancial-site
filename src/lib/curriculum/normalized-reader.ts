import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  CURRICULUM_LEVELS,
  CURRICULUM_TRACKS,
  curriculumLessonId,
  type CurriculumLevel,
  type CurriculumTrack,
  type NormalizedLessonRecord,
} from "@/lib/curriculum/contract";

const ROOT = process.cwd();
const INDEX_ROOT = join(ROOT, "content", "generated", "curriculum-index");

type LocaleRegistry = {
  defaultLocale: string;
  locales: Array<{ locale: string; fallbackChain?: string[]; status: string }>;
};

let registryCache: LocaleRegistry | null = null;
const shardCache = new Map<string, NormalizedLessonRecord[]>();

function registry(): LocaleRegistry {
  if (registryCache) return registryCache;
  registryCache = JSON.parse(readFileSync(join(ROOT, "content", "registries", "locales.json"), "utf8")) as LocaleRegistry;
  return registryCache;
}

function normalizeLocale(locale: string): string {
  const wanted = locale.replaceAll("_", "-").toLowerCase();
  return registry().locales.find((x) => x.locale.toLowerCase() === wanted)?.locale
    ?? (wanted === "en" ? registry().defaultLocale : locale.replaceAll("_", "-"));
}

export function curriculumLocaleFallbackChain(locale: string): string[] {
  const normalized = normalizeLocale(locale);
  const entry = registry().locales.find((x) => x.locale === normalized);
  return [...new Set([normalized, ...(entry?.fallbackChain ?? []), registry().defaultLocale])];
}

function shard(track: CurriculumTrack, level: CurriculumLevel, locale: string): NormalizedLessonRecord[] {
  const key = `${track}|L${level}|${locale}`;
  const cached = shardCache.get(key);
  if (cached) return cached;
  const path = join(INDEX_ROOT, track, `L${level}`, `${locale}.json`);
  if (!existsSync(path)) {
    shardCache.set(key, []);
    return [];
  }
  const rows = JSON.parse(readFileSync(path, "utf8")) as NormalizedLessonRecord[];
  shardCache.set(key, rows);
  return rows;
}

export function getNormalizedLesson(
  track: CurriculumTrack,
  level: CurriculumLevel,
  lesson: number,
  locale = "en-US",
): NormalizedLessonRecord | null {
  if (!CURRICULUM_TRACKS.includes(track) || !CURRICULUM_LEVELS.includes(level)) return null;
  const id = curriculumLessonId(track, level, lesson);
  for (const candidate of curriculumLocaleFallbackChain(locale)) {
    const hit = shard(track, level, candidate).find((row) => row.id === id);
    if (hit && !["missing", "placeholder", "template", "stale"].includes(hit.status)) return hit;
  }
  return null;
}

export function clearNormalizedCurriculumCache(): void {
  shardCache.clear();
  registryCache = null;
}
