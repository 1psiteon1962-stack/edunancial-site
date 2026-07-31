import { parseCurriculumId } from "@/lib/adaptive-learning";

const TRACK_ALIASES: Record<string, "red" | "white" | "blue"> = {
  red: "red",
  "red-real-estate": "red",
  white: "white",
  "white-paper-assets": "white",
  blue: "blue",
  "blue-business": "blue",
};

const LEGACY_COURSE_PATTERN = /^([a-z]+)-level-(\d+)$/i;
const LEGACY_LESSON_PATTERN = /^([a-z]+)-(\d)(\d{2})$/i;

export interface CanonicalCourseRoute {
  track: string;
  level: number | null;
  href: string;
}

export interface CanonicalLessonRoute {
  track: string;
  level: number;
  lessonId: string;
  href: string;
}

export function getCanonicalCourseRoute(courseId: string): CanonicalCourseRoute | null {
  const normalized = courseId.trim().toLowerCase();
  const aliasedTrack = TRACK_ALIASES[normalized];
  if (aliasedTrack) {
    return {
      track: aliasedTrack,
      level: null,
      href: `/curriculum/${aliasedTrack}`,
    };
  }

  const legacyMatch = normalized.match(LEGACY_COURSE_PATTERN);
  if (!legacyMatch) {
    return null;
  }

  const [, trackPart, levelPart] = legacyMatch;
  const track = TRACK_ALIASES[trackPart];
  const level = Number(levelPart);
  if (!track || !Number.isInteger(level) || level < 1) {
    return null;
  }

  return {
    track,
    level,
    href: `/curriculum/${track}/l${level}`,
  };
}

export function getCanonicalCourseHref(courseId: string): string {
  return getCanonicalCourseRoute(courseId)?.href ?? `/courses/${courseId}`;
}

export function getCanonicalLessonRoute(
  courseId: string,
  lessonId: string,
): CanonicalLessonRoute | null {
  const parsedCanonical = parseCurriculumId(lessonId.trim().toUpperCase());
  if (parsedCanonical) {
    return {
      track: parsedCanonical.track.toLowerCase(),
      level: Number(parsedCanonical.level.slice(1)),
      lessonId: parsedCanonical.id.toLowerCase(),
      href: `/curriculum/${parsedCanonical.track.toLowerCase()}/${parsedCanonical.level.toLowerCase()}/${parsedCanonical.id.toLowerCase()}`,
    };
  }

  const legacyMatch = lessonId.trim().toLowerCase().match(LEGACY_LESSON_PATTERN);
  if (!legacyMatch) {
    return null;
  }

  const [, lessonTrackPart, levelDigit, lessonDigits] = legacyMatch;
  const courseTrack = getCanonicalCourseRoute(courseId)?.track ?? TRACK_ALIASES[lessonTrackPart];
  const lessonTrack = TRACK_ALIASES[lessonTrackPart];
  const track = courseTrack ?? lessonTrack;
  const level = Number(levelDigit);
  const lessonNumber = Number(lessonDigits);

  if (!track || !lessonTrack || track !== lessonTrack || !Number.isInteger(level) || level < 1) {
    return null;
  }

  const canonicalLessonId = `${track.toUpperCase()}-L${level}-${String(lessonNumber).padStart(3, "0")}`;

  return {
    track,
    level,
    lessonId: canonicalLessonId.toLowerCase(),
    href: `/curriculum/${track}/l${level}/${canonicalLessonId.toLowerCase()}`,
  };
}

export function getCanonicalLessonHref(courseId: string, lessonId: string): string {
  return getCanonicalLessonRoute(courseId, lessonId)?.href ?? `/courses/${courseId}/lessons/${lessonId}`;
}
