import type { PublishedCourse } from "@/lib/curriculum/authoritative-published";
import { getNeonSql } from "@/lib/db/neon";

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

function requireSql() {
  const sql = getNeonSql();
  if (!sql) throw new Error("Course progress persistence is not configured.");
  return sql;
}

export async function getCourseProgressRows(userId: string): Promise<CourseProgressRow[]> {
  const sql=requireSql();
  return await sql`select * from course_progress where user_id=${userId} order by last_activity_at desc` as CourseProgressRow[];
}

export async function getCourseProgressRow(userId:string,courseId:string):Promise<CourseProgressRow|null> {
  const sql=requireSql();
  const rows=await sql`select * from course_progress where user_id=${userId} and course_id=${courseId} limit 1`;
  return (rows[0] as CourseProgressRow | undefined) ?? null;
}

export async function upsertCourseProgress(input: {
  userId:string; course:PublishedCourse; activeLessonId:string; completeLesson?:boolean; lastPositionSeconds?:number;
}):Promise<CourseProgressRow> {
  const sql=requireSql();
  const existing=await getCourseProgressRow(input.userId,input.course.id);
  const orderedLessonIds=input.course.lessons.map((lesson)=>lesson.id.toUpperCase());
  const completedLessonIds=input.completeLesson ? [...(existing?.completed_lesson_ids ?? []),input.activeLessonId] : (existing?.completed_lesson_ids ?? []);
  const state=computeProgressState({
    completedLessonIds,totalLessons:orderedLessonIds.length,orderedLessonIds,
    activeLessonId:input.activeLessonId.toUpperCase(),lastPositionSeconds:input.lastPositionSeconds,
    startedAt:existing?.started_at,completedAt:existing?.completed_at ?? null,
  });
  const lastActivityAt=new Date().toISOString();
  const rows=await sql`
    insert into course_progress
      (user_id,course_id,last_lesson_id,completed_lesson_ids,progress_percent,last_position_seconds,
       completed,started_at,last_activity_at,completed_at)
    values
      (${input.userId},${input.course.id},${state.lastLessonId},${state.completedLessonIds},
       ${state.progressPercent},${state.lastPositionSeconds},${state.completed},${state.startedAt},
       ${lastActivityAt},${state.completedAt})
    on conflict (user_id,course_id) do update set
      last_lesson_id=excluded.last_lesson_id,completed_lesson_ids=excluded.completed_lesson_ids,
      progress_percent=excluded.progress_percent,last_position_seconds=excluded.last_position_seconds,
      completed=excluded.completed,started_at=excluded.started_at,last_activity_at=excluded.last_activity_at,
      completed_at=excluded.completed_at
    returning *
  `;
  if(!rows[0]) throw new Error("Unable to update course progress: no row returned.");
  return rows[0] as CourseProgressRow;
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
