import { getPublishedCourses, getPublishedLesson } from "@/lib/curriculum/authoritative-published";

import {
  normalizeMembershipToAccessTier,
  canRecordLessonProgressForTier,
  type LearningProgressCurrentUser,
} from "./access";
import {
  buildOverallCompletionSummary,
  buildTrackProgressSummaries,
  type CurriculumLessonSummary,
} from "./aggregates";
import {
  getLessonProgress,
  listLessonProgressByUser,
  listLessonProgressByUserAndCourse,
  listTrackProgressByUser,
  upsertLessonProgress,
  upsertTrackProgress,
} from "./repository";
import {
  LEARNING_PROGRESS_TRACK_CODES,
  type AccessTierAtRecord,
  type CourseProgressSummaryDto,
  type DashboardProgressDto,
  type LearningLevelCode,
  type LearningTrackCode,
  type LessonProgressDto,
  type LessonProgressWriteInput,
  type MarkLessonCompletedInput,
  type UserLessonProgressRow,
} from "./types";

const SUPPORTED_TRACKS = new Set<LearningTrackCode>(LEARNING_PROGRESS_TRACK_CODES);

interface ResolvedLessonMetadata {
  lessonId: string;
  courseId: string;
  trackCode: LearningTrackCode;
  levelCode: LearningLevelCode;
  lessonNumber: number;
  level: number;
}

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeSeconds(value: number): number {
  return Math.max(0, Math.floor(value));
}

function assertCurrentUser(currentUser: LearningProgressCurrentUser): void {
  if (!currentUser?.id) {
    throw new Error("A valid authenticated user context is required.");
  }
}

function toLevelCode(level: number): LearningLevelCode {
  if (level < 1 || level > 5) {
    throw new Error(`Unsupported lesson level: ${level}`);
  }

  return `L${level}` as LearningLevelCode;
}

function lessonRowToDto(row: UserLessonProgressRow): LessonProgressDto {
  return {
    lessonId: row.lesson_id,
    courseId: row.course_id,
    trackCode: row.track_code,
    levelCode: row.level_code,
    lessonNumber: row.lesson_number,
    status: row.status,
    progressPercent: row.progress_percent,
    secondsWatched: row.seconds_watched,
    lastPositionSeconds: row.last_position_seconds,
    firstViewedAt: row.first_viewed_at,
    lastViewedAt: row.last_viewed_at,
    completedAt: row.completed_at,
    accessTierAtRecord: row.access_tier_at_record,
  };
}

async function getCatalogLessons(): Promise<CurriculumLessonSummary[]> {
  const courses = await getPublishedCourses("en");

  return courses
    .flatMap((course) =>
      course.lessons.map((lesson) => ({
        lessonId: lesson.id,
        courseId: course.id,
        trackCode: lesson.track.toUpperCase() as LearningTrackCode,
        levelCode: toLevelCode(lesson.level),
        lessonNumber: lesson.lessonNumber,
      })),
    )
    .filter((lesson): lesson is CurriculumLessonSummary => SUPPORTED_TRACKS.has(lesson.trackCode));
}

async function resolveLessonMetadata(input: LessonProgressWriteInput): Promise<ResolvedLessonMetadata> {
  const lessonId = input.lessonId.toUpperCase();
  const lesson = await getPublishedLesson(lessonId, "en");
  if (!lesson) {
    throw new Error(`Lesson not found in published curriculum: ${lessonId}`);
  }

  const trackCode = lesson.track.toUpperCase() as LearningTrackCode;
  if (!SUPPORTED_TRACKS.has(trackCode)) {
    throw new Error(`Lesson track is not enabled for learner progress: ${lesson.track}`);
  }

  const courses = await getPublishedCourses("en");
  const containingCourse = courses.find((course) =>
    course.lessons.some((courseLesson) => courseLesson.id === lesson.id),
  );

  const resolvedCourseId = input.courseId ?? containingCourse?.id;
  if (!resolvedCourseId) {
    throw new Error(`Unable to resolve course for lesson: ${lessonId}`);
  }

  return {
    lessonId,
    courseId: resolvedCourseId,
    trackCode,
    levelCode: toLevelCode(lesson.level),
    lessonNumber: lesson.lessonNumber,
    level: lesson.level,
  };
}

function canAccessByTier({
  tier,
  levelCode,
  lessonNumber,
}: {
  tier: AccessTierAtRecord;
  levelCode: LearningLevelCode;
  lessonNumber: number;
}): boolean {
  if (tier === "admin") return true;
  const level = Number(levelCode.slice(1));

  switch (tier) {
    case "test-drive":
      return level === 1 && lessonNumber >= 1 && lessonNumber <= 3;
    case "free":
      return level === 1 && lessonNumber >= 1 && lessonNumber <= 3;
    case "basic":
      return level <= 2;
    case "pro":
      return level <= 4;
    case "gold":
      return true;
    default:
      return false;
  }
}

async function rebuildTrackProgressForUser(
  userId: string,
  tier: AccessTierAtRecord,
): Promise<void> {
  const [catalogLessons, lessonRows] = await Promise.all([
    getCatalogLessons(),
    listLessonProgressByUser(userId),
  ]);

  const trackSummaries = buildTrackProgressSummaries({
    lessons: catalogLessons,
    progressRows: lessonRows,
    tier,
    canAccess: ({ tier: summaryTier, levelCode, lessonNumber }) => canAccessByTier({
      tier: summaryTier,
      levelCode,
      lessonNumber,
    }),
  });

  await Promise.all(trackSummaries.map((summary) =>
    upsertTrackProgress({
      user_id: userId,
      track_code: summary.trackCode,
      lessons_started: summary.lessonsStarted,
      lessons_completed: summary.lessonsCompleted,
      total_lessons: summary.totalLessons,
      completion_percentage: summary.completionPercentage,
      current_level: summary.currentLevel,
      current_lesson_id: summary.currentLessonId,
      last_lesson_id: summary.lastLessonId,
      last_accessed_at: summary.lastAccessedAt,
    })),
  );
}

export async function recordLessonProgress(
  input: LessonProgressWriteInput,
  currentUser: LearningProgressCurrentUser,
): Promise<LessonProgressDto> {
  assertCurrentUser(currentUser);

  const metadata = await resolveLessonMetadata(input);

  if (!canRecordLessonProgressForTier({
    level: metadata.level,
    lessonNumber: metadata.lessonNumber,
    membershipTier: currentUser.membershipTier,
    isAdmin: currentUser.isAdmin,
  })) {
    throw new Error("Current membership tier does not allow lesson access.");
  }

  const tierAtRecord = normalizeMembershipToAccessTier(
    currentUser.membershipTier,
    currentUser.isAdmin,
  );

  const existing = await getLessonProgress(currentUser.id, metadata.lessonId);
  const nowIso = new Date().toISOString();

  const progressPercent = clampPercent(
    input.progressPercent ?? existing?.progress_percent ?? 0,
  );
  const secondsWatched = normalizeSeconds(
    input.secondsWatched ?? existing?.seconds_watched ?? 0,
  );
  const lastPositionSeconds = normalizeSeconds(
    input.lastPositionSeconds ?? existing?.last_position_seconds ?? 0,
  );

  const nextStatus = input.status
    ?? (progressPercent >= 100 ? "completed" : (secondsWatched > 0 || lastPositionSeconds > 0 ? "in_progress" : "not_started"));

  const completedAt = nextStatus === "completed"
    ? (existing?.completed_at ?? nowIso)
    : existing?.completed_at ?? null;

  const row = await upsertLessonProgress({
    user_id: currentUser.id,
    course_id: metadata.courseId,
    lesson_id: metadata.lessonId,
    track_code: metadata.trackCode,
    level_code: metadata.levelCode,
    lesson_number: metadata.lessonNumber,
    status: nextStatus,
    progress_percent: progressPercent,
    seconds_watched: secondsWatched,
    last_position_seconds: lastPositionSeconds,
    first_viewed_at: existing?.first_viewed_at ?? nowIso,
    last_viewed_at: nowIso,
    completed_at: completedAt,
    access_tier_at_record: tierAtRecord,
  });

  await rebuildTrackProgressForUser(currentUser.id, tierAtRecord);

  return lessonRowToDto(row);
}

export async function markLessonCompleted(
  input: MarkLessonCompletedInput,
  currentUser: LearningProgressCurrentUser,
): Promise<LessonProgressDto> {
  return recordLessonProgress(
    {
      lessonId: input.lessonId,
      courseId: input.courseId,
      status: "completed",
      progressPercent: 100,
    },
    currentUser,
  );
}

export async function getLessonProgressForUser(
  lessonId: string,
  currentUser: LearningProgressCurrentUser,
): Promise<LessonProgressDto | null> {
  assertCurrentUser(currentUser);
  const row = await getLessonProgress(currentUser.id, lessonId.toUpperCase());
  return row ? lessonRowToDto(row) : null;
}

export async function getDashboardProgress(
  currentUser: LearningProgressCurrentUser,
): Promise<DashboardProgressDto> {
  assertCurrentUser(currentUser);

  const tier = normalizeMembershipToAccessTier(
    currentUser.membershipTier,
    currentUser.isAdmin,
  );

  const [catalogLessons, lessonRows] = await Promise.all([
    getCatalogLessons(),
    listLessonProgressByUser(currentUser.id),
  ]);

  const byTrack = buildTrackProgressSummaries({
    lessons: catalogLessons,
    progressRows: lessonRows,
    tier,
    canAccess: ({ tier: summaryTier, levelCode, lessonNumber }) => canAccessByTier({
      tier: summaryTier,
      levelCode,
      lessonNumber,
    }),
  });

  return {
    byTrack,
    overall: buildOverallCompletionSummary(byTrack),
  };
}

export async function getCourseProgressSummaries(
  currentUser: LearningProgressCurrentUser,
): Promise<CourseProgressSummaryDto[]> {
  assertCurrentUser(currentUser);

  const tier = normalizeMembershipToAccessTier(
    currentUser.membershipTier,
    currentUser.isAdmin,
  );

  const catalogLessons = await getCatalogLessons();
  const courseIds = [...new Set(catalogLessons.map((lesson) => lesson.courseId))];

  return Promise.all(courseIds.map(async (courseId) => {
    const courseLessons = catalogLessons
      .filter((lesson) => lesson.courseId === courseId)
      .sort((a, b) => {
        if (a.levelCode !== b.levelCode) return a.levelCode.localeCompare(b.levelCode);
        return a.lessonNumber - b.lessonNumber;
      });

    const courseRows = await listLessonProgressByUserAndCourse(currentUser.id, courseId);
    const trackCode = courseLessons[0]?.trackCode ?? "RED";

    const completed = courseRows.filter((row) => row.status === "completed" || row.progress_percent >= 100).length;
    const started = courseRows.filter((row) =>
      row.status !== "not_started"
      || row.progress_percent > 0
      || row.seconds_watched > 0
      || row.last_position_seconds > 0,
    ).length;

    const completedLessonIds = new Set(
      courseRows
        .filter((row) => row.status === "completed" || row.progress_percent >= 100)
        .map((row) => row.lesson_id),
    );

    const nextLesson = courseLessons.find((lesson) =>
      !completedLessonIds.has(lesson.lessonId)
      && canAccessByTier({ tier, levelCode: lesson.levelCode, lessonNumber: lesson.lessonNumber }),
    );

    const totalLessons = courseLessons.length;

    return {
      courseId,
      trackCode,
      totalLessons,
      lessonsStarted: started,
      lessonsCompleted: completed,
      completionPercentage: totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0,
      nextLessonId: nextLesson?.lessonId ?? null,
    };
  }));
}

export async function listPersistedTrackProgressForUser(
  currentUser: LearningProgressCurrentUser,
) {
  assertCurrentUser(currentUser);
  return listTrackProgressByUser(currentUser.id);
}
