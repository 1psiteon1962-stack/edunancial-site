import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { createCurriculumLessonPullRequest } from "@/lib/admin-content/github";

function validLessonId(id: string) { return /^[A-Z][A-Z0-9]*-L[1-9][0-9]*-[0-9]{3,}$/u.test(id); }

export async function POST(request: Request) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  let body: { lessonId?: string; content?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { lessonId, content } = body;
  if (!lessonId || typeof content !== "string") {
    return NextResponse.json({ error: "lessonId and content are required" }, { status: 400 });
  }

  if (!validLessonId(lessonId)) {
    return NextResponse.json({ error: "Invalid lesson ID format" }, { status: 400 });
  }

  // Validate that the content contains required sections before saving
  if (!content.includes("## Learning Objectives") || !content.includes("## Core Content")) {
    return NextResponse.json(
      { error: "Lesson must contain '## Learning Objectives' and '## Core Content' sections" },
      { status: 422 },
    );
  }

  try {
    const publication = await createCurriculumLessonPullRequest({ lessonId, content, operation: "update" });
    return NextResponse.json({ ok: true, message: `Lesson ${lessonId} update submitted for canonical publication.`, ...publication });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 422 });
  }
}
