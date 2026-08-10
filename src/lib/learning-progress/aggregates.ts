import { LEARNING_PROGRESS_TRACK_CODES } from "./types";
import type {
  AccessTierAtRecord,
  LearningLevelCode,
  LearningTrackCode,
  UserLessonProgressRow,
  OverallProgressSummaryDto,
  TrackProgressSummaryDto,
} from "./types";

export interface CurriculumLessonSummary {
  lessonId: string;
  courseId: string;
  trackCode: LearningTrackCode;
  levelCode: LearningLevelCode;
  lessonNumber: number;
}

export interface AggregateAccessEvaluatorInput {
  tier: AccessTierAtRecord;
  lessonId: string;
  levelCode: LearningLevelCode;
  lessonNumber: number;
}

export type AggregateAccessEvaluator = (
  input: AggregateAccessEvaluatorInput,
) => boolean;

export function countCompletedLessons(rows: UserLessonProgressRow[]): number {
  return rows.filter((row) => row.status === "completed" || row.progress_percent >= 100).length;
}

export function countStartedLessons(rows: UserLessonProgressRow[]): number {
  return rows.filter((row) =>
    row.status !== "not_started"
    || row.progress_percent > 0
    || row.seconds_watched > 0
    || row.last_position_seconds > 0,
  ).length;
}

export function chooseNextAccessibleUnfinishedLesson({
  lessons,
  progressRows,
  tier,
  canAccess,
}: {
  lessons: CurriculumLessonSummary[];
  progressRows: UserLessonProgressRow[];
  tier: AccessTierAtRecord;
  canAccess: AggregateAccessEvaluator;
}): CurriculumLessonSummary | null {
  const completed = new Set(
    progressRows
      .filter((row) => row.status === "completed" || row.progress_percent >= 100)
      .map((row) => row.lesson_id),
  );

  for (const lesson of lessons) {
    if (completed.has(lesson.lessonId)) continue;
    if (!canAccess({
      tier,
      lessonId: lesson.lessonId,
      levelCode: lesson.levelCode,
      lessonNumber: lesson.lessonNumber,
    })) {
      continue;
    }

    return lesson;
  }

  return null;
}

export function buildTrackProgressSummaries({
  lessons,
  progressRows,
  tier,
  canAccess,
}: {
  lessons: CurriculumLessonSummary[];
  progressRows: UserLessonProgressRow[];
  tier: AccessTierAtRecord;
  canAccess: AggregateAccessEvaluator;
}): TrackProgressSummaryDto[] {
  const rowsByLessonId = new Map(progressRows.map((row) => [row.lesson_id, row]));

  return LEARNING_PROGRESS_TRACK_CODES.map((trackCode) => {
    const trackLessons = lessons
      .filter((lesson) => lesson.trackCode === trackCode)
      .sort((a, b) => {
        if (a.levelCode !== b.levelCode) return a.levelCode.localeCompare(b.levelCode);
        return a.lessonNumber - b.lessonNumber;
      });

    const trackRows = trackLessons
      .map((lesson) => rowsByLessonId.get(lesson.lessonId))
      .filter((row): row is UserLessonProgressRow => Boolean(row));

    const lessonsCompleted = countCompletedLessons(trackRows);
    const lessonsStarted = countStartedLessons(trackRows);
    const totalLessons = trackLessons.length;
    const completionPercentage = totalLessons > 0
      ? Math.round((lessonsCompleted / totalLessons) * 100)
      : 0;

    const nextLesson = chooseNextAccessibleUnfinishedLesson({
      lessons: trackLessons,
      progressRows: trackRows,
      tier,
      canAccess,
    });

    const lastViewed = [...trackRows]
      .filter((row) => row.last_viewed_at)
      .sort((a, b) => (a.last_viewed_at ?? "").localeCompare(b.last_viewed_at ?? ""))
      .at(-1) ?? null;

    return {
      trackCode,
      lessonsStarted,
      lessonsCompleted,
      totalLessons,
      completionPercentage,
      currentLevel: nextLesson?.levelCode ?? null,
      currentLessonId: nextLesson?.lessonId ?? null,
      nextLessonId: nextLesson?.lessonId ?? null,
      lastLessonId: lastViewed?.lesson_id ?? null,
      lastAccessedAt: lastViewed?.last_viewed_at ?? null,
    };
  });
}

export function buildOverallCompletionSummary(
  trackSummaries: TrackProgressSummaryDto[],
): OverallProgressSummaryDto {
  const totalLessons = trackSummaries.reduce((sum, track) => sum + track.totalLessons, 0);
  const lessonsStarted = trackSummaries.reduce((sum, track) => sum + track.lessonsStarted, 0);
  const lessonsCompleted = trackSummaries.reduce((sum, track) => sum + track.lessonsCompleted, 0);

  return {
    totalLessons,
    lessonsStarted,
    lessonsCompleted,
    completionPercentage: totalLessons > 0
      ? Math.round((lessonsCompleted / totalLessons) * 100)
      : 0,
  };
}
