export const LEARNING_PROGRESS_TRACK_CODES = [
  "RED",
  "WHITE",
  "BLUE",
  "GOLD",
  "ORANGE",
  "BLACK",
] as const;

export const LEARNING_PROGRESS_LEVEL_CODES = ["L1", "L2", "L3", "L4", "L5"] as const;

export const LESSON_PROGRESS_STATUSES = [
  "not_started",
  "in_progress",
  "completed",
] as const;

export const ACCESS_TIERS_AT_RECORD = [
  "free",
  "test-drive",
  "basic",
  "pro",
  "gold",
  "admin",
] as const;

export type LearningTrackCode = (typeof LEARNING_PROGRESS_TRACK_CODES)[number];
export type LearningLevelCode = (typeof LEARNING_PROGRESS_LEVEL_CODES)[number];
export type LessonProgressStatus = (typeof LESSON_PROGRESS_STATUSES)[number];
export type AccessTierAtRecord = (typeof ACCESS_TIERS_AT_RECORD)[number];

export interface UserLessonProgressRow {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string;
  track_code: LearningTrackCode;
  level_code: LearningLevelCode;
  lesson_number: number;
  status: LessonProgressStatus;
  progress_percent: number;
  seconds_watched: number;
  last_position_seconds: number;
  first_viewed_at: string | null;
  last_viewed_at: string | null;
  completed_at: string | null;
  access_tier_at_record: AccessTierAtRecord;
  created_at: string;
  updated_at: string;
}

export interface UserTrackProgressRow {
  id: string;
  user_id: string;
  track_code: LearningTrackCode;
  lessons_started: number;
  lessons_completed: number;
  total_lessons: number;
  completion_percentage: number;
  current_level: LearningLevelCode | null;
  current_lesson_id: string | null;
  last_lesson_id: string | null;
  last_accessed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LessonProgressWriteInput {
  lessonId: string;
  courseId?: string;
  status?: LessonProgressStatus;
  progressPercent?: number;
  secondsWatched?: number;
  lastPositionSeconds?: number;
}

export interface MarkLessonCompletedInput {
  lessonId: string;
  courseId?: string;
}

export interface LessonProgressDto {
  lessonId: string;
  courseId: string;
  trackCode: LearningTrackCode;
  levelCode: LearningLevelCode;
  lessonNumber: number;
  status: LessonProgressStatus;
  progressPercent: number;
  secondsWatched: number;
  lastPositionSeconds: number;
  firstViewedAt: string | null;
  lastViewedAt: string | null;
  completedAt: string | null;
  accessTierAtRecord: AccessTierAtRecord;
}

export interface TrackProgressSummaryDto {
  trackCode: LearningTrackCode;
  lessonsStarted: number;
  lessonsCompleted: number;
  totalLessons: number;
  completionPercentage: number;
  currentLevel: LearningLevelCode | null;
  currentLessonId: string | null;
  nextLessonId: string | null;
  lastLessonId: string | null;
  lastAccessedAt: string | null;
}

export interface OverallProgressSummaryDto {
  totalLessons: number;
  lessonsStarted: number;
  lessonsCompleted: number;
  completionPercentage: number;
}

export interface DashboardProgressDto {
  byTrack: TrackProgressSummaryDto[];
  overall: OverallProgressSummaryDto;
}

export interface CourseProgressSummaryDto {
  courseId: string;
  trackCode: LearningTrackCode;
  totalLessons: number;
  lessonsStarted: number;
  lessonsCompleted: number;
  completionPercentage: number;
  nextLessonId: string | null;
}
