/**
 * Production Curriculum Catalog
 *
 * Reads exclusively from curriculum/registry.json via the adaptive-learning
 * pipeline.  Never falls back to demo data.  Returns an empty array when no
 * curriculum has been imported into the registry.
 */

import {
  getAdaptiveCurriculumCatalog,
  NORTH_AMERICA_TRACKS,
  TRACK_COLOR_STYLES,
  type AdaptiveTrackCode,
  type AdaptiveLessonRecord,
} from "./adaptive-learning";

export interface ProductionTrackEntry {
  /** Lowercase track code used as a URL slug, e.g. "red". */
  id: string;
  trackCode: AdaptiveTrackCode;
  title: string;
  lessonCount: number;
  lessons: AdaptiveLessonRecord[];
  /** Tailwind bg-* class for the track's colour bar. */
  colorClass: string;
}

/**
 * Returns curriculum tracks registered in curriculum/registry.json.
 *
 * - Returns an empty array when the registry contains no tracks.
 * - Never silently falls back to demo / hard-coded data.
 * - Automatically reflects new lessons after `npm run curriculum:import`
 *   and a rebuild.
 */
export function getProductionCatalog(): ProductionTrackEntry[] {
  const lessons = getAdaptiveCurriculumCatalog();

  const trackMap = new Map<AdaptiveTrackCode, AdaptiveLessonRecord[]>();
  for (const lesson of lessons) {
    if (!trackMap.has(lesson.track)) {
      trackMap.set(lesson.track, []);
    }
    trackMap.get(lesson.track)!.push(lesson);
  }

  return Array.from(trackMap.entries()).map(([trackCode, trackLessons]) => ({
    id: trackCode.toLowerCase(),
    trackCode,
    title: NORTH_AMERICA_TRACKS[trackCode] ?? trackCode,
    lessonCount: trackLessons.length,
    lessons: trackLessons,
    colorClass: TRACK_COLOR_STYLES[trackCode] ?? "bg-slate-500",
  }));
}

/**
 * The three North America tracks the curriculum pipeline expects.
 * Used in the empty-state warning on the catalog page.
 */
export const EXPECTED_TRACKS: ReadonlyArray<{
  code: AdaptiveTrackCode;
  name: string;
  expectedPath: string;
}> = [
  {
    code: "RED",
    name: "Real Estate",
    expectedPath: "content/curriculum/RED/L1/",
  },
  {
    code: "WHITE",
    name: "Paper Assets",
    expectedPath: "content/curriculum/WHITE/L1/",
  },
  {
    code: "BLUE",
    name: "Business",
    expectedPath: "content/curriculum/BLUE/L1/",
  },
];
