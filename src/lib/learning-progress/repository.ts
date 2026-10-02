import { getNeonSql } from "@/lib/db/neon";

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

function requireSql() {
  const sql = getNeonSql();
  if (!sql) throw new Error("Learning progress persistence is not configured.");
  return sql;
}

export async function getLessonProgress(userId: string, lessonId: string): Promise<UserLessonProgressRow | null> {
  const sql = requireSql();
  const rows = await sql`select * from user_lesson_progress where user_id=${userId} and lesson_id=${lessonId} limit 1`;
  return (rows[0] as UserLessonProgressRow | undefined) ?? null;
}

export async function upsertLessonProgress(input: UpsertLessonProgressInput): Promise<UserLessonProgressRow> {
  const sql = requireSql();
  const rows = await sql`
    insert into user_lesson_progress
      (user_id,course_id,lesson_id,track_code,level_code,lesson_number,status,progress_percent,
       seconds_watched,last_position_seconds,first_viewed_at,last_viewed_at,completed_at,access_tier_at_record)
    values
      (${input.user_id},${input.course_id},${input.lesson_id},${input.track_code},${input.level_code},
       ${input.lesson_number},${input.status},${input.progress_percent},${input.seconds_watched},
       ${input.last_position_seconds},${input.first_viewed_at},${input.last_viewed_at},${input.completed_at},
       ${input.access_tier_at_record})
    on conflict (user_id,lesson_id) do update set
      course_id=excluded.course_id, track_code=excluded.track_code, level_code=excluded.level_code,
      lesson_number=excluded.lesson_number, status=excluded.status, progress_percent=excluded.progress_percent,
      seconds_watched=excluded.seconds_watched, last_position_seconds=excluded.last_position_seconds,
      first_viewed_at=excluded.first_viewed_at, last_viewed_at=excluded.last_viewed_at,
      completed_at=excluded.completed_at, access_tier_at_record=excluded.access_tier_at_record
    returning *
  `;
  if (!rows[0]) throw new Error("Failed to upsert user_lesson_progress row.");
  return rows[0] as UserLessonProgressRow;
}

export async function listLessonProgressByUser(userId: string): Promise<UserLessonProgressRow[]> {
  const sql = requireSql();
  return await sql`select * from user_lesson_progress where user_id=${userId}` as UserLessonProgressRow[];
}

export async function listLessonProgressByUserAndCourse(userId: string, courseId: string): Promise<UserLessonProgressRow[]> {
  const sql = requireSql();
  return await sql`select * from user_lesson_progress where user_id=${userId} and course_id=${courseId}` as UserLessonProgressRow[];
}

export async function listTrackProgressByUser(userId: string): Promise<UserTrackProgressRow[]> {
  const sql = requireSql();
  return await sql`select * from user_track_progress where user_id=${userId} order by track_code asc` as UserTrackProgressRow[];
}

export async function upsertTrackProgress(input: UpsertTrackProgressInput): Promise<UserTrackProgressRow> {
  const sql = requireSql();
  const rows = await sql`
    insert into user_track_progress
      (user_id,track_code,lessons_started,lessons_completed,total_lessons,completion_percentage,
       current_level,current_lesson_id,last_lesson_id,last_accessed_at)
    values
      (${input.user_id},${input.track_code},${input.lessons_started},${input.lessons_completed},
       ${input.total_lessons},${input.completion_percentage},${input.current_level},
       ${input.current_lesson_id},${input.last_lesson_id},${input.last_accessed_at})
    on conflict (user_id,track_code) do update set
      lessons_started=excluded.lessons_started, lessons_completed=excluded.lessons_completed,
      total_lessons=excluded.total_lessons, completion_percentage=excluded.completion_percentage,
      current_level=excluded.current_level, current_lesson_id=excluded.current_lesson_id,
      last_lesson_id=excluded.last_lesson_id, last_accessed_at=excluded.last_accessed_at
    returning *
  `;
  if (!rows[0]) throw new Error("Failed to upsert user_track_progress row.");
  return rows[0] as UserTrackProgressRow;
}
