import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { createCurriculumLessonDeletePullRequest } from "@/lib/admin-content/github";

function validLessonId(id: string) {
  return /^[A-Z][A-Z0-9]*-L[1-9][0-9]*-[0-9]{3,}$/u.test(id);
}

export async function POST(request: Request) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  let body: { lessonId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const lessonId = body.lessonId?.toUpperCase();
  if (!lessonId) return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
  if (!validLessonId(lessonId)) return NextResponse.json({ error: "Invalid lesson ID format" }, { status: 400 });

  try {
    const publication = await createCurriculumLessonDeletePullRequest(lessonId);
    return NextResponse.json({
      ok: true,
      message: `Lesson ${lessonId} deletion submitted for canonical publication.`,
      ...publication,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: message.includes("does not exist") ? 404 : 422 });
  }
}
