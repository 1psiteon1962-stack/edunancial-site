import { NextResponse } from "next/server";

import { requireAuthenticatedMemberWrite } from "@/lib/auth/server";
import { getPublishedCourses } from "@/lib/curriculum/authoritative-published";
import { getServerLanguage } from "@/lib/international/server";
import { resolveCourseProgress, upsertCourseProgress } from "@/lib/member/progress";

interface ProgressCompleteBody {
  courseId?: string;
  lessonId?: string;
}

export async function POST(request: Request) {
  const auth = await requireAuthenticatedMemberWrite(request, "member-progress-complete", "complete");
  if (!auth.ok) {
    return auth.response;
  }
  const member = auth.session.user;
  if (!member) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  let body: ProgressCompleteBody;
  try {
    body = (await request.json()) as ProgressCompleteBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!body.courseId || !body.lessonId) {
    return NextResponse.json({ error: "courseId and lessonId are required." }, { status: 400 });
  }
  const lessonId = body.lessonId.toUpperCase();

  const language = await getServerLanguage();
  const courses = await getPublishedCourses(language);
  const course = courses.find((candidate) => candidate.id === body.courseId);
  if (!course || !course.lessons.some((lesson) => lesson.id === lessonId)) {
    return NextResponse.json({ error: "Unknown course or lesson." }, { status: 404 });
  }

  const row = await upsertCourseProgress({
    userId: member.id,
    course,
    activeLessonId: lessonId,
    completeLesson: true,
  });

  return NextResponse.json({ progress: resolveCourseProgress(row, course) });
}
