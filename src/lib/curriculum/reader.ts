/**
 * Curriculum Reader
 *
 * Server-side utilities for reading the curriculum registry and lesson content.
 * This module reads directly from the file system and is designed for use in
 * Next.js Server Components and API routes.
 *
 * Content additions require only running `npm run curriculum:import`.
 * No code changes are needed when new lessons are added.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  ACADEMIES,
  ACADEMY_MAP,
  academyLevels,
  isLessonVisible,
  type MembershipTier,
} from "./academies";

export type { MembershipTier };

const REPO_ROOT = join(process.cwd());
const REGISTRY_PATH = join(REPO_ROOT, "curriculum", "registry.json");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RegistryAsset {
  id: string;
  type: "lesson" | "manifest" | "batch-verification";
  track: string;
  trackName: string;
  level: number;
  lessonNumber?: number;
  title: string;
  version: string;
  author: string;
  date: string;
  path: string;
  checksum: string;
  status: "active" | "archived" | "superseded";
  ingestionId: string;
  importedAt: string;
  validationPassed: boolean;
  warnings: string[];
  /** Optional membership tier required to access this lesson (defaults to "free") */
  membership?: string;
  metadata: Record<string, string>;
}

export interface RegistryLevel {
  assets: Record<string, RegistryAsset>;
}

export interface RegistryTrack {
  code: string;
  name: string;
  levels: Record<string, RegistryLevel>;
}

export interface Registry {
  _schema: string;
  _version: string;
  _generated: string;
  _note: string;
  tracks: Record<string, RegistryTrack>;
}

export interface LessonMeta {
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
  status: "active" | "archived" | "superseded";
  importedAt: string;
  /** Membership tier required to access this lesson (defaults to "free") */
  membership: string;
}

export interface LessonContent {
  meta: LessonMeta;
  /** Raw markdown content with front-matter stripped */
  body: string;
  /** Front-matter as a key-value map */
  frontMatter: Record<string, string>;
}

const PLACEHOLDER_LESSON_ID_PATTERN = /^([A-Z]+)-L(\d+)-(\d{3})$/;

export interface TrackSummary {
  code: string;
  name: string;
  /** Short description from the academy definition (empty string for non-primary tracks) */
  description: string;
  levels: LevelSummary[];
}

export interface LevelSummary {
  level: number;
  lessonCount: number;
  lessons: LessonMeta[];
}

// ---------------------------------------------------------------------------
// Registry helpers
// ---------------------------------------------------------------------------

let _cachedRegistry: Registry | null = null;

export function readRegistry(): Registry {
  if (_cachedRegistry) return _cachedRegistry;
  if (!existsSync(REGISTRY_PATH)) {
    return {
      _schema: "curriculum/schemas/registry.schema.json",
      _version: "1.0",
      _generated: new Date().toISOString(),
      _note: "Empty registry",
      tracks: {},
    };
  }
  _cachedRegistry = JSON.parse(readFileSync(REGISTRY_PATH, "utf-8")) as Registry;
  return _cachedRegistry;
}

/** Invalidate the in-process cache (useful in dev or after imports) */
export function invalidateRegistryCache(): void {
  _cachedRegistry = null;
}

// ---------------------------------------------------------------------------
// Track / level queries
// ---------------------------------------------------------------------------

/**
 * Build a list of LevelSummary objects for a track.
 *
 * For primary academies (RED, WHITE, BLUE) all five levels are always included,
 * even when no lessons exist in a level.  For other tracks only registry levels
 * are returned (existing behaviour).
 *
 * @param track   - Registry track object (may be undefined when the academy has no registry entry yet).
 * @param code    - Track code (e.g. "RED").
 * @param viewer  - Membership tier or "admin".  Defaults to "free" (anonymous visitor).
 */
function buildLevelSummaries(
  track: RegistryTrack | undefined,
  code: string,
  viewer: MembershipTier | "admin" = "free",
): LevelSummary[] {
  const academyDef = ACADEMY_MAP.get(code);
  const canonicalLevels = academyDef ? academyLevels(academyDef) : undefined;

  // Determine which level numbers to include.
  const registryLevelNums = track
    ? Object.keys(track.levels).map(Number).sort((a, b) => a - b)
    : [];

  let levelNums: number[];
  if (canonicalLevels) {
    // Always include all canonical levels for primary academies.
    // Merge canonical levels with any extra registry levels (future-proof).
    const allNums = new Set([...canonicalLevels, ...registryLevelNums]);
    levelNums = Array.from(allNums).sort((a, b) => a - b);
  } else {
    levelNums = registryLevelNums;
  }

  return levelNums.map((levelNum) => {
    const levelData = track?.levels[String(levelNum)];
    const lessons = levelData
      ? Object.values(levelData.assets)
          .filter((a): a is RegistryAsset & { lessonNumber: number } => {
            if (a.type !== "lesson" || a.status !== "active" || typeof a.lessonNumber !== "number") {
              return false;
            }
            // Apply membership filter
            const lessonTier = a.membership ?? a.metadata?.membership ?? "free";
            return isLessonVisible(lessonTier, viewer);
          })
          .sort((a, b) => a.lessonNumber - b.lessonNumber)
          .map(assetToLessonMeta)
      : [];
    return {
      level: levelNum,
      lessonCount: lessons.length,
      lessons,
    };
  });
}

/**
 * Returns all tracks that have at least one registry entry.
 *
 * For primary academies (RED, WHITE, BLUE) all five levels are always included.
 * Use `listAcademies()` when you need all three primary academies to appear even
 * when they have no registry data yet.
 *
 * @param viewer  - Membership tier or "admin" for visibility filtering.  Defaults to "free".
 */
export function listTracks(viewer: MembershipTier | "admin" = "free"): TrackSummary[] {
  const registry = readRegistry();
  return Object.values(registry.tracks).map((track) => {
    const academyDef = ACADEMY_MAP.get(track.code);
    return {
      code: track.code,
      name: track.name,
      description: academyDef?.description ?? "",
      levels: buildLevelSummaries(track, track.code, viewer),
    };
  });
}

/**
 * Returns all three primary academies (RED, WHITE, BLUE) always — even when
 * they have no lessons yet — each with five levels.
 *
 * Empty levels still appear and carry `lessonCount: 0`.
 * Use this for the curriculum landing page and academy navigation.
 *
 * @param viewer  - Membership tier or "admin" for visibility filtering.  Defaults to "free".
 */
export function listAcademies(viewer: MembershipTier | "admin" = "free"): TrackSummary[] {
  const registry = readRegistry();
  return ACADEMIES.map((academyDef) => {
    const registryTrack = registry.tracks[academyDef.code];
    return {
      code: academyDef.code,
      name: academyDef.name,
      description: academyDef.description,
      levels: buildLevelSummaries(registryTrack, academyDef.code, viewer),
    };
  });
}

export function getTrack(
  trackCode: string,
  viewer: MembershipTier | "admin" = "free",
): TrackSummary | null {
  const registry = readRegistry();
  const upper = trackCode.toUpperCase();
  const registryTrack = registry.tracks[upper];
  const academyDef = ACADEMY_MAP.get(upper);

  // For primary academies always return a summary even without registry data.
  if (!registryTrack && !academyDef) return null;

  const name = registryTrack?.name ?? academyDef!.name;
  const description = academyDef?.description ?? "";

  return {
    code: upper,
    name,
    description,
    levels: buildLevelSummaries(registryTrack, upper, viewer),
  };
}

export function getLessonsForLevel(
  trackCode: string,
  level: number,
  viewer: MembershipTier | "admin" = "free",
): LessonMeta[] {
  const registry = readRegistry();
  const track = registry.tracks[trackCode.toUpperCase()];
  if (!track) return [];
  const levelData = track.levels[String(level)];
  if (!levelData) return [];
  return Object.values(levelData.assets)
    .filter((a): a is RegistryAsset & { lessonNumber: number } => {
      if (a.type !== "lesson" || a.status !== "active" || typeof a.lessonNumber !== "number") {
        return false;
      }
      const lessonTier = a.membership ?? a.metadata?.membership ?? "free";
      return isLessonVisible(lessonTier, viewer);
    })
    .sort((a, b) => a.lessonNumber - b.lessonNumber)
    .map(assetToLessonMeta);
}

export function getLessonMeta(lessonId: string): LessonMeta | null {
  const registry = readRegistry();
  for (const track of Object.values(registry.tracks)) {
    for (const level of Object.values(track.levels)) {
      const asset = level.assets[lessonId];
      if (asset && asset.type === "lesson" && typeof asset.lessonNumber === "number") {
        return assetToLessonMeta(asset as RegistryAsset & { lessonNumber: number });
      }
    }
  }
  return null;
}

export function getPlaceholderLessonMeta(
  trackCode: string,
  lessonId: string,
  expectedLevel?: number,
): LessonMeta | null {
  const upperTrackCode = trackCode.toUpperCase();
  const academyDef = ACADEMY_MAP.get(upperTrackCode);
  if (!academyDef) return null;

  const match = lessonId.toUpperCase().match(PLACEHOLDER_LESSON_ID_PATTERN);
  if (!match) return null;

  const [, lessonTrack, levelRaw, lessonNumberRaw] = match;
  const level = Number(levelRaw);
  const lessonNumber = Number(lessonNumberRaw);
  const validLevels = academyLevels(academyDef);

  if (
    lessonTrack !== upperTrackCode ||
    !validLevels.includes(level) ||
    (typeof expectedLevel === "number" && level !== expectedLevel)
  ) {
    return null;
  }

  return {
    id: lessonId.toUpperCase(),
    track: upperTrackCode,
    trackName: academyDef.name,
    level,
    lessonNumber,
    title: `${academyDef.name} Lesson ${lessonNumber}`,
    summary: "This lesson belongs to an active curriculum track and will be published soon.",
    author: "Edunancial Faculty",
    date: "",
    version: "",
    status: "active",
    importedAt: "",
    membership: "free",
  };
}

// ---------------------------------------------------------------------------
// Lesson content
// ---------------------------------------------------------------------------

export function getLessonContent(lessonId: string): LessonContent | null {
  const registry = readRegistry();
  let asset: RegistryAsset | null = null;

  for (const track of Object.values(registry.tracks)) {
    for (const level of Object.values(track.levels)) {
      if (level.assets[lessonId]) {
        asset = level.assets[lessonId];
        break;
      }
    }
    if (asset) break;
  }

  if (!asset || asset.type !== "lesson" || typeof asset.lessonNumber !== "number") {
    return null;
  }

  const absPath = join(REPO_ROOT, asset.path);
  if (!existsSync(absPath)) return null;

  const raw = readFileSync(absPath, "utf-8");
  const { frontMatter, body } = parseFrontMatter(raw);

  return {
    meta: assetToLessonMeta(asset as RegistryAsset & { lessonNumber: number }),
    body,
    frontMatter,
  };
}

// ---------------------------------------------------------------------------
// Navigation helpers
// ---------------------------------------------------------------------------

export function getLessonNavigation(
  lessonId: string
): { prev: LessonMeta | null; next: LessonMeta | null } {
  const meta = getLessonMeta(lessonId);
  if (!meta) return { prev: null, next: null };
  const siblings = getLessonsForLevel(meta.track, meta.level);
  const idx = siblings.findIndex((l) => l.id === lessonId);
  return {
    prev: idx > 0 ? siblings[idx - 1] : null,
    next: idx < siblings.length - 1 ? siblings[idx + 1] : null,
  };
}

// ---------------------------------------------------------------------------
// Static params for generateStaticParams
// ---------------------------------------------------------------------------

export function getAllLessonStaticParams(): Array<{
  track: string;
  level: string;
  lesson: string;
}> {
  const registry = readRegistry();
  const params: Array<{ track: string; level: string; lesson: string }> = [];
  for (const track of Object.values(registry.tracks)) {
    for (const [levelKey, level] of Object.entries(track.levels)) {
      for (const asset of Object.values(level.assets)) {
        if (asset.type === "lesson" && asset.status === "active") {
          params.push({
            track: track.code.toLowerCase(),
            level: `l${levelKey}`,
            lesson: asset.id.toLowerCase(),
          });
        }
      }
    }
  }
  return params;
}

export function getAllTrackLevelStaticParams(): Array<{
  track: string;
  level: string;
}> {
  const registry = readRegistry();
  const params: Array<{ track: string; level: string }> = [];

  // Include all primary academy levels (ensures static pages are generated
  // even before any lessons exist).
  const included = new Set<string>();
  for (const academy of ACADEMIES) {
    for (let lvl = 1; lvl <= academy.levelCount; lvl++) {
      const key = `${academy.code.toLowerCase()}:l${lvl}`;
      if (!included.has(key)) {
        included.add(key);
        params.push({ track: academy.code.toLowerCase(), level: `l${lvl}` });
      }
    }
  }

  // Also include any additional registry tracks/levels not covered above.
  for (const track of Object.values(registry.tracks)) {
    for (const levelKey of Object.keys(track.levels)) {
      const key = `${track.code.toLowerCase()}:l${levelKey}`;
      if (!included.has(key)) {
        included.add(key);
        params.push({ track: track.code.toLowerCase(), level: `l${levelKey}` });
      }
    }
  }

  return params;
}

// ---------------------------------------------------------------------------
// Sitemap helpers
// ---------------------------------------------------------------------------

export function getCurriculumSitemapEntries(baseUrl: string): Array<{
  url: string;
  lastModified: Date;
  changeFrequency: "weekly";
  priority: number;
}> {
  const registry = readRegistry();
  const entries: ReturnType<typeof getCurriculumSitemapEntries> = [];
  for (const track of Object.values(registry.tracks)) {
    // Track level page
    entries.push({
      url: `${baseUrl}/curriculum/${track.code.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
    for (const [levelKey, level] of Object.entries(track.levels)) {
      // Level page
      entries.push({
        url: `${baseUrl}/curriculum/${track.code.toLowerCase()}/l${levelKey}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
      for (const asset of Object.values(level.assets)) {
        if (asset.type === "lesson" && asset.status === "active") {
          entries.push({
            url: `${baseUrl}/curriculum/${track.code.toLowerCase()}/l${levelKey}/${asset.id.toLowerCase()}`,
            lastModified: new Date(asset.importedAt),
            changeFrequency: "weekly",
            priority: 0.8,
          });
        }
      }
    }
  }
  return entries;
}

// ---------------------------------------------------------------------------
// Search index helpers
// ---------------------------------------------------------------------------

export interface LessonSearchEntry {
  id: string;
  url: string;
  title: string;
  summary: string;
  track: string;
  trackName: string;
  level: number;
  lessonNumber: number;
}

export function getCurriculumSearchIndex(): LessonSearchEntry[] {
  const registry = readRegistry();
  const entries: LessonSearchEntry[] = [];
  for (const track of Object.values(registry.tracks)) {
    for (const [levelKey, level] of Object.entries(track.levels)) {
      for (const asset of Object.values(level.assets)) {
        if (
          asset.type === "lesson" &&
          asset.status === "active" &&
          typeof asset.lessonNumber === "number"
        ) {
          entries.push({
            id: asset.id,
            url: `/curriculum/${track.code.toLowerCase()}/l${levelKey}/${asset.id.toLowerCase()}`,
            title: asset.title,
            summary: asset.metadata?.summary ?? "",
            track: track.code,
            trackName: track.name,
            level: Number(levelKey),
            lessonNumber: asset.lessonNumber,
          });
        }
      }
    }
  }
  return entries.sort((a, b) =>
    a.track.localeCompare(b.track) || a.level - b.level || a.lessonNumber - b.lessonNumber
  );
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function assetToLessonMeta(
  asset: RegistryAsset & { lessonNumber: number }
): LessonMeta {
  return {
    id: asset.id,
    track: asset.track,
    trackName: asset.trackName,
    level: asset.level,
    lessonNumber: asset.lessonNumber,
    title: asset.title,
    summary: asset.metadata?.summary ?? "",
    author: asset.author,
    date: asset.date,
    version: asset.version,
    status: asset.status,
    importedAt: asset.importedAt,
    membership: asset.membership ?? asset.metadata?.membership ?? "free",
  };
}

function parseFrontMatter(content: string): {
  frontMatter: Record<string, string>;
  body: string;
} {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { frontMatter: {}, body: content };
  }
  const fm: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colonIdx = line.indexOf(":");
    if (colonIdx < 0) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (key) fm[key] = value;
  }
  return { frontMatter: fm, body: match[2] };
}
