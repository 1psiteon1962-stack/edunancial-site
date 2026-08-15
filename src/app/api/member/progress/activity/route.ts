import { NextResponse } from "next/server";

import { requireAuthenticatedMemberWrite } from "@/lib/auth/server";
import { getPublishedCourses } from "@/lib/curriculum/authoritative-published";
import { getServerLanguage } from "@/lib/international/server";
import { recordSecurityEvent } from "@/lib/member/security";
import { upsertCourseProgress } from "@/lib/member/progress";

interface ProgressActivityBody {
  courseId?: string;
  lessonId?: string;
  lastPositionSeconds?: number;
}

export async function POST(request: Request) {
  const auth = await requireAuthenticatedMemberWrite(request, "member-progress-activity", "activity");
  if (!auth.ok) {
    return auth.response;
  }
  const member = auth.session.user;
  if (!member) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  let body: ProgressActivityBody;
  try {
    body = (await request.json()) as ProgressActivityBody;
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
    lastPositionSeconds: body.lastPositionSeconds,
  });

  await recordSecurityEvent({
    userId: member.id,
    eventType: "learning.activity",
    outcome: "success",
    metadata: { courseId: body.courseId, lessonId },
  }).catch(() => undefined);

  return NextResponse.json({ progress: row });
}
