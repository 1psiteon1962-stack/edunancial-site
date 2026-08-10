import { supabaseSelect, supabaseUpsert } from "@/lib/supabase/server";

import type {
  UserLessonProgressRow,
  UserTrackProgressRow,
  AccessTierAtRecord,
  LearningLevelCode,
  LearningTrackCode,
  LessonProgressStatus,
} from "./types";

interface UpsertLessonProgressInput {
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
}

interface UpsertTrackProgressInput {
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
}

export async function getLessonProgress(
  userId: string,
  lessonId: string,
): Promise<UserLessonProgressRow | null> {
  const rows = await supabaseSelect<UserLessonProgressRow>("user_lesson_progress", {
    filters: {
      user_id: userId,
      lesson_id: lessonId,
    },
    limit: 1,
  });

  return rows[0] ?? null;
}

export async function upsertLessonProgress(
  input: UpsertLessonProgressInput,
): Promise<UserLessonProgressRow> {
  const rows = await supabaseUpsert<UserLessonProgressRow>(
    "user_lesson_progress",
    { ...input },
    "user_id,lesson_id",
  );

  if (!rows[0]) {
    throw new Error("Failed to upsert user_lesson_progress row.");
  }

  return rows[0];
}

export function listLessonProgressByUser(userId: string): Promise<UserLessonProgressRow[]> {
  return supabaseSelect<UserLessonProgressRow>("user_lesson_progress", {
    filters: { user_id: userId },
  });
}

export function listLessonProgressByUserAndCourse(
  userId: string,
  courseId: string,
): Promise<UserLessonProgressRow[]> {
  return supabaseSelect<UserLessonProgressRow>("user_lesson_progress", {
    filters: {
      user_id: userId,
      course_id: courseId,
    },
  });
}

export function listTrackProgressByUser(userId: string): Promise<UserTrackProgressRow[]> {
  return supabaseSelect<UserTrackProgressRow>("user_track_progress", {
    filters: { user_id: userId },
    order: { column: "track_code", ascending: true },
  });
}

export async function upsertTrackProgress(
  input: UpsertTrackProgressInput,
): Promise<UserTrackProgressRow> {
  const rows = await supabaseUpsert<UserTrackProgressRow>(
    "user_track_progress",
    { ...input },
    "user_id,track_code",
  );

  if (!rows[0]) {
    throw new Error("Failed to upsert user_track_progress row.");
  }

  return rows[0];
}
