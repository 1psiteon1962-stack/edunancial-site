import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { upsertPublishedLessonFromRegistry } from "@/lib/curriculum/authoritative-published";
import { revalidatePublishedCurriculumRoutes } from "@/lib/curriculum/revalidate";
import { invalidateRegistryCache } from "@/lib/curriculum/reader";

function lessonFilePath(id: string): string | null {
  const match = id.match(/^([A-Z]+)-L(\d+)-(\d{3})$/);
  if (!match) return null;
  const [, track, level] = match;
  return join(process.cwd(), `content/curriculum/${track}/L${level}/${id}.md`);
}

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

  const filePath = lessonFilePath(lessonId);
  if (!filePath) {
    return NextResponse.json({ error: "Invalid lesson ID format" }, { status: 400 });
  }

  // Validate that the content contains required sections before saving
  if (!content.includes("## Learning Objectives") || !content.includes("## Core Content")) {
    return NextResponse.json(
      { error: "Lesson must contain '## Learning Objectives' and '## Core Content' sections" },
      { status: 422 },
    );
  }

  await writeFile(filePath, content, "utf8");
  invalidateRegistryCache();
  await upsertPublishedLessonFromRegistry(lessonId);
  await revalidatePublishedCurriculumRoutes();

  return NextResponse.json({ ok: true, message: `Lesson ${lessonId} saved.` });
}
