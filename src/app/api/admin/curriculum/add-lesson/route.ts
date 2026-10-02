import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { createCurriculumLessonPullRequest } from "@/lib/admin-content/github";
import { getLocalizedTrackCopy } from "@/lib/curriculum/localization";

function trackNameFromCode(code: string): string {
  return getLocalizedTrackCopy(code, "en")?.name ?? code;
}

export async function POST(request: Request) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  let body: {
    track?: string;
    level?: number;
    lessonNumber?: number;
    title?: string;
    summary?: string;
    author?: string;
    content?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { track, level, lessonNumber, title, summary, author, content } = body;

  if (!track || typeof track !== "string") {
    return NextResponse.json({ error: "track is required (e.g. RED, WHITE, BLUE)" }, { status: 400 });
  }
  if (typeof level !== "number" || level < 1) {
    return NextResponse.json({ error: "level must be a positive integer" }, { status: 400 });
  }
  if (typeof lessonNumber !== "number" || lessonNumber < 1) {
    return NextResponse.json({ error: "lessonNumber must be a positive integer" }, { status: 400 });
  }
  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "content (markdown body) is required" }, { status: 400 });
  }

  const trackUpper = track.toUpperCase();
  const lessonNumStr = String(lessonNumber).padStart(3, "0");
  const lessonId = `${trackUpper}-L${level}-${lessonNumStr}`;
  const canonicalPath = `content/curriculum/${trackUpper}/L${level}/${lessonId}.md`;

  const today = new Date().toISOString().slice(0, 10);
  const authorName = (typeof author === "string" && author.trim()) ? author.trim() : "Edunancial Faculty";
  const summaryText = (typeof summary === "string" && summary.trim()) ? summary.trim() : "";

  const frontMatter = [
    "---",
    `id: ${lessonId}`,
    `track: ${trackUpper}`,
    `officialTrackName: ${trackNameFromCode(trackUpper)}`,
    `level: ${level}`,
    `lessonNumber: ${lessonNumber}`,
    `title: ${title}`,
    `version: 1.0`,
    `author: ${authorName}`,
    `date: ${today}`,
    summaryText ? `summary: ${summaryText}` : null,
    "---",
  ].filter(Boolean).join("\n");

  const fullContent = `${frontMatter}\n\n${content}`;

  try {
    const publication = await createCurriculumLessonPullRequest({ lessonId, content: fullContent, operation: "create" });
    return NextResponse.json({
      ok: true,
      lessonId,
      filePath: canonicalPath,
      message: `Lesson ${lessonId} creation submitted for canonical publication.`,
      ...publication,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: message.includes("already exists") ? 409 : 422 });
  }
}
