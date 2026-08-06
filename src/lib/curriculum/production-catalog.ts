/**
 * Production Curriculum Catalog
 *
 * Derives all course and lesson data EXCLUSIVELY from the production
 * curriculum registry (curriculum/registry.json).
 *
 * When the registry is empty or contains no lessons, this module returns
 * empty collections — it does NOT fall back to any hard-coded demo data.
 *
 * All production-facing curriculum pages (course catalog, course detail,
 * lesson pages, quizzes, search, my-courses) must import from this module
 * instead of from @/data/course-platform.
 *
 * To add courses to the live site: populate curriculum/registry.json via
 * `npm run curriculum:import` and they will appear automatically.
 */

import {
  getAdaptiveCurriculumCatalog,
  NORTH_AMERICA_TRACKS,
  type AdaptiveLessonRecord,
  type AdaptiveTrackCode,
} from "@/lib/adaptive-learning";
import {
  getLocalizedLessonTitle,
  getLocalizedTrackCopy,
  resolveCurriculumLocale,
  type CurriculumLocale,
} from "@/lib/curriculum/localization";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type CourseCategory = string;

/**
 * A production course derived from the curriculum registry.
 *
 * Intentionally absent: rating, reviewCount, enrolledCount, totalDuration,
 * instructor, price. These are fake demo fields from the old course-platform
 * module and must NOT appear in any production curriculum surface.
 */
export interface ProductionCourse {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  /** Ordered list of lesson IDs that belong to this course. */
  lessons: string[];
  /** Tailwind bg class used for colour-coding (e.g. "bg-red-700"). */
  color: string;
  isFree: boolean;
  isFeatured: boolean;
  tags: string[];
}

/**
 * A production lesson derived from the curriculum registry.
 *
 * Fields that are absent in the registry default to safe empty values
 * rather than fake demo content.
 */
export interface ProductionLesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  /** "—" when the registry does not supply a duration. */
  duration: string;
  notes: string;
  transcript: string | null;
  downloadUrl: string | null;
  quizId: string | null;
  videoUrl: string;
}

/**
 * Minimal quiz type. The production registry does not currently define
 * quiz content, so this is an empty collection. Import from here rather
 * than course-platform so the type contract is clear.
 */
export interface ProductionQuiz {
  id: string;
  title: string;
  courseId: string | null;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
  passingScore: number;
}

export interface ProductionInstructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  courses: string[];
  students: number;
  rating: number;
}

// ─── Internal constants ───────────────────────────────────────────────────────

const TRACK_TO_COURSE_ID: Record<AdaptiveTrackCode, string> = {
  RED: "red",
  WHITE: "white",
  BLUE: "blue",
};

const TRACK_DIFFICULTY: Record<AdaptiveTrackCode, Difficulty> = {
  RED: "Intermediate",
  WHITE: "Intermediate",
  BLUE: "Intermediate",
};

const TRACK_COLOR: Record<AdaptiveTrackCode, string> = {
  RED: "bg-red-700",
  WHITE: "bg-slate-200",
  BLUE: "bg-blue-700",
};

const TRACK_SUBTITLE: Record<AdaptiveTrackCode, string> = {
  RED: "Real estate investing strategies: rentals, tax liens, tax deeds, and creative financing.",
  WHITE: "Paper asset investing: stocks, bonds, ETFs, and retirement accounts.",
  BLUE: "Business competency: starting, growing, and managing a business.",
};

const TRACK_ORDER = Object.keys(NORTH_AMERICA_TRACKS) as AdaptiveTrackCode[];

// ─── Build catalog from registry ─────────────────────────────────────────────

const _registryCatalog: AdaptiveLessonRecord[] = getAdaptiveCurriculumCatalog();

// Group lessons by track to form courses
const _trackGroups = new Map<AdaptiveTrackCode, AdaptiveLessonRecord[]>();
for (const record of _registryCatalog) {
  const list = _trackGroups.get(record.track) ?? [];
  list.push(record);
  _trackGroups.set(record.track, list);
}

// Derive ProductionCourse for each track that has at least one lesson
function _buildCourse(
  trackCode: AdaptiveTrackCode,
  records: AdaptiveLessonRecord[],
  locale: CurriculumLocale = "en",
): ProductionCourse {
  const localizedTrack = getLocalizedTrackCopy(trackCode, locale);
  const trackName = localizedTrack?.name ?? NORTH_AMERICA_TRACKS[trackCode];
  const subtitle = localizedTrack?.subtitle ?? TRACK_SUBTITLE[trackCode];
  return {
    id: TRACK_TO_COURSE_ID[trackCode],
    title: `${trackCode}: ${trackName}`,
    subtitle,
    description: subtitle,
    category: localizedTrack?.category ?? NORTH_AMERICA_TRACKS[trackCode],
    difficulty: TRACK_DIFFICULTY[trackCode],
    lessons: records.map((r) => r.id),
    color: TRACK_COLOR[trackCode],
    isFree: false,
    isFeatured: false,
    tags: [trackName],
  };
}

function _buildLesson(
  record: AdaptiveLessonRecord,
  locale: CurriculumLocale = "en",
): ProductionLesson {
  const courseId = TRACK_TO_COURSE_ID[record.track] ?? record.track.toLowerCase();
  return {
    id: record.id,
    courseId,
    title: getLocalizedLessonTitle(record.id, locale, record.title),
    description: locale === "en" ? record.metadata["description"] ?? "" : "",
    duration: record.metadata["duration"] ?? "—",
    notes: record.metadata["notes"] ?? "",
    transcript: record.metadata["transcript"] ?? null,
    downloadUrl: record.metadata["downloadUrl"] ?? null,
    quizId: record.metadata["quizId"] ?? null,
    videoUrl: record.metadata["videoUrl"] ?? "",
  };
}

// ─── Exported collections ─────────────────────────────────────────────────────

/**
 * All courses derived from the production curriculum registry.
 * Empty when the registry has no lessons.
 */
export const courseList: ProductionCourse[] = TRACK_ORDER.map((trackCode) =>
  _buildCourse(trackCode, _trackGroups.get(trackCode) ?? []),
);

/**
 * All lessons derived from the production curriculum registry.
 * Empty when the registry has no lessons.
 */
export const lessonList: ProductionLesson[] = _registryCatalog.map((record) => _buildLesson(record));

/**
 * No quizzes are registered in the production registry.
 * Import from here instead of course-platform to avoid demo quiz data.
 */
export const quizList: ProductionQuiz[] = [];

/**
 * Record lookup for courses by course ID.
 */
export const courses: Record<string, ProductionCourse> = Object.fromEntries(
  courseList.map((c) => [c.id, c]),
);

/**
 * Record lookup for lessons by lesson ID.
 */
export const lessons: Record<string, ProductionLesson> = Object.fromEntries(
  lessonList.map((l) => [l.id, l]),
);

/**
 * No quizzes are registered in the production registry.
 */
export const quizzes: Record<string, ProductionQuiz> = {};

/**
 * No instructors are registered in the production registry.
 */
export const instructors: Record<string, ProductionInstructor> = {};

/**
 * No instructors are registered in the production registry.
 */
export const instructorList: ProductionInstructor[] = [];

/**
 * Unique course categories present in the registry.
 */
export const categories: string[] = [
  ...new Set(courseList.map((c) => c.category)),
];

/** Tailwind colour classes for each known category. */
export const categoryColors: Record<string, string> = {
  "Real Estate": "bg-red-800 text-white",
  "Paper Assets": "bg-slate-200 text-slate-900",
  Business: "bg-blue-800 text-white",
};

export function getCoursePrimaryHref(course: Pick<ProductionCourse, "id" | "lessons">): string {
  return course.lessons[0]
    ? `/courses/${course.id}/lessons/${course.lessons[0]}`
    : `/courses/${course.id}`;
}

export function getLocalizedCourseList(languageCode: string): ProductionCourse[] {
  const locale = resolveCurriculumLocale(languageCode);
  return TRACK_ORDER.map((trackCode) => _buildCourse(trackCode, _trackGroups.get(trackCode) ?? [], locale));
}

export function getLocalizedCourseMap(languageCode: string): Record<string, ProductionCourse> {
  return Object.fromEntries(getLocalizedCourseList(languageCode).map((course) => [course.id, course]));
}

export function getLocalizedLessonList(languageCode: string): ProductionLesson[] {
  const locale = resolveCurriculumLocale(languageCode);
  return _registryCatalog.map((record) => _buildLesson(record, locale));
}

export function getLocalizedLessonMap(languageCode: string): Record<string, ProductionLesson> {
  return Object.fromEntries(getLocalizedLessonList(languageCode).map((lesson) => [lesson.id, lesson]));
}
