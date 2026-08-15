import type { PublishedCourse } from "@/lib/curriculum/authoritative-published";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export interface CourseProgressRow {
  id: string;
  user_id: string;
  course_id: string;
  last_lesson_id: string | null;
  completed_lesson_ids: string[];
  progress_percent: number;
  last_position_seconds: number;
  completed: boolean;
  started_at: string;
  last_activity_at: string;
  completed_at: string | null;
  updated_at: string;
}

export interface ResolvedCourseProgress extends CourseProgressRow {
  total_lessons: number;
  completed_lessons_count: number;
  next_lesson_id: string | null;
  continue_href: string;
}

export function computeProgressState(input: {
  completedLessonIds: string[];
  totalLessons: number;
  orderedLessonIds: string[];
  activeLessonId?: string | null;
  lastPositionSeconds?: number;
  startedAt?: string;
  completedAt?: string | null;
}) {
  const uniqueCompleted = Array.from(new Set(input.completedLessonIds.map((lessonId) => lessonId.toUpperCase())));
  const authoritativeCompleted = uniqueCompleted.filter((lessonId) => input.orderedLessonIds.includes(lessonId));
  const totalLessons = Math.max(0, input.totalLessons);
  const completedCount = Math.min(authoritativeCompleted.length, totalLessons);
  const progressPercent = totalLessons === 0
    ? 0
    : Math.min(100, Math.max(0, Number(((completedCount / totalLessons) * 100).toFixed(2))));
  const completed = totalLessons > 0 && completedCount >= totalLessons;
  const nextLessonId = completed
    ? null
    : input.orderedLessonIds.find((lessonId) => !authoritativeCompleted.includes(lessonId)) ?? input.activeLessonId ?? null;

  return {
    completedLessonIds: authoritativeCompleted,
    completedCount,
    progressPercent,
    completed,
    nextLessonId,
    completedAt: completed ? (input.completedAt ?? new Date().toISOString()) : null,
    lastLessonId: input.activeLessonId ?? nextLessonId ?? input.orderedLessonIds[0] ?? null,
    lastPositionSeconds: Math.max(0, Math.floor(input.lastPositionSeconds ?? 0)),
    startedAt: input.startedAt ?? new Date().toISOString(),
  };
}

export async function getCourseProgressRows(userId: string): Promise<CourseProgressRow[]> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("course_progress")
    .select("id, user_id, course_id, last_lesson_id, completed_lesson_ids, progress_percent, last_position_seconds, completed, started_at, last_activity_at, completed_at, updated_at")
    .eq("user_id", userId)
    .order("last_activity_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load course progress: ${error.message}`);
  }

  return (data ?? []) as CourseProgressRow[];
}

export async function getCourseProgressRow(userId: string, courseId: string): Promise<CourseProgressRow | null> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("course_progress")
    .select("id, user_id, course_id, last_lesson_id, completed_lesson_ids, progress_percent, last_position_seconds, completed, started_at, last_activity_at, completed_at, updated_at")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load course progress row: ${error.message}`);
  }

  return (data as CourseProgressRow | null) ?? null;
}

export async function upsertCourseProgress(input: {
  userId: string;
  course: PublishedCourse;
  activeLessonId: string;
  completeLesson?: boolean;
  lastPositionSeconds?: number;
}): Promise<CourseProgressRow> {
  const admin = getSupabaseAdminClient();
  const existing = await getCourseProgressRow(input.userId, input.course.id);
  const orderedLessonIds = input.course.lessons.map((lesson) => lesson.id.toUpperCase());
  const existingCompleted = existing?.completed_lesson_ids ?? [];
  const completedLessonIds = input.completeLesson
    ? [...existingCompleted, input.activeLessonId]
    : existingCompleted;
  const state = computeProgressState({
    completedLessonIds,
    totalLessons: orderedLessonIds.length,
    orderedLessonIds,
    activeLessonId: input.activeLessonId.toUpperCase(),
    lastPositionSeconds: input.lastPositionSeconds,
    startedAt: existing?.started_at,
    completedAt: existing?.completed_at ?? null,
  });

  const payload = {
    user_id: input.userId,
    course_id: input.course.id,
    last_lesson_id: state.lastLessonId,
    completed_lesson_ids: state.completedLessonIds,
    progress_percent: state.progressPercent,
    last_position_seconds: state.lastPositionSeconds,
    completed: state.completed,
    started_at: state.startedAt,
    last_activity_at: new Date().toISOString(),
    completed_at: state.completedAt,
  };

  const { data, error } = await admin
    .from("course_progress")
    .upsert(payload, { onConflict: "user_id,course_id", ignoreDuplicates: false })
    .select("id, user_id, course_id, last_lesson_id, completed_lesson_ids, progress_percent, last_position_seconds, completed, started_at, last_activity_at, completed_at, updated_at")
    .single();

  if (error || !data) {
    throw new Error(`Unable to update course progress: ${error?.message ?? "unknown error"}`);
  }

  return data as CourseProgressRow;
}

export function resolveCourseProgress(row: CourseProgressRow | null, course: PublishedCourse): ResolvedCourseProgress {
  const orderedLessonIds = course.lessons.map((lesson) => lesson.id.toUpperCase());
  const state = computeProgressState({
    completedLessonIds: row?.completed_lesson_ids ?? [],
    totalLessons: orderedLessonIds.length,
    orderedLessonIds,
    activeLessonId: row?.last_lesson_id ?? null,
    lastPositionSeconds: row?.last_position_seconds ?? 0,
    startedAt: row?.started_at,
    completedAt: row?.completed_at ?? null,
  });

  const baseRow: CourseProgressRow = row ?? {
    id: `${course.id}:pending`,
    user_id: "",
    course_id: course.id,
    last_lesson_id: state.lastLessonId,
    completed_lesson_ids: state.completedLessonIds,
    progress_percent: state.progressPercent,
    last_position_seconds: state.lastPositionSeconds,
    completed: state.completed,
    started_at: state.startedAt,
    last_activity_at: state.startedAt,
    completed_at: state.completedAt,
    updated_at: state.startedAt,
  };

  return {
    ...baseRow,
    last_lesson_id: state.lastLessonId,
    completed_lesson_ids: state.completedLessonIds,
    progress_percent: state.progressPercent,
    completed: state.completed,
    completed_at: state.completedAt,
    total_lessons: orderedLessonIds.length,
    completed_lessons_count: state.completedCount,
    next_lesson_id: state.nextLessonId,
    continue_href: state.nextLessonId
      ? `/courses/${course.id}/lessons/${state.nextLessonId.toLowerCase()}`
      : `/courses/${course.id}`,
  };
}
