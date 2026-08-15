import { NextResponse } from "next/server";

import { requireAuthenticatedMember } from "@/lib/auth/server";
import { getPublishedCourses } from "@/lib/curriculum/authoritative-published";
import { getServerLanguage } from "@/lib/international/server";
import { getCourseProgressRows, resolveCourseProgress } from "@/lib/member/progress";

export async function GET() {
  const auth = await requireAuthenticatedMember();
  if (!auth.ok) {
    return auth.response;
  }

  const language = await getServerLanguage();
  const [courses, rows] = await Promise.all([
    getPublishedCourses(language),
    getCourseProgressRows(auth.session.user.id),
  ]);

  const rowsByCourseId = new Map(rows.map((row) => [row.course_id, row]));
  const progress = courses.map((course) => ({
    courseId: course.id,
    title: course.title,
    category: course.category,
    difficulty: course.difficulty,
    lessonIds: course.lessons.map((lesson) => lesson.id),
    ...resolveCourseProgress(rowsByCourseId.get(course.id) ?? null, course),
  }));

  return NextResponse.json({ progress });
}
