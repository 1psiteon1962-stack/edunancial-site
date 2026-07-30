import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import Link from "next/link";

import { requireAdminPageSession } from "@/lib/admin-content/auth";
import LessonEditorClient from "./LessonEditorClient";

interface Props {
  params: Promise<{ lessonId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { lessonId } = await params;
  return { title: `Edit ${lessonId} | Curriculum | Edunancial Admin` };
}

/** Map curriculum ID (RED-L1-001) to the canonical filesystem path */
function lessonFilePath(id: string): string | null {
  const match = id.match(/^([A-Z]+)-L(\d+)-(\d{3})$/);
  if (!match) return null;
  const [, track, level] = match;
  return join(process.cwd(), `content/curriculum/${track}/L${level}/${id}.md`);
}

/** Map curriculum ID to the public lesson route */
function publicLessonUrl(id: string): string | null {
  const match = id.match(/^RED-L1-(\d{3})$/);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  const courseNum = `1${String(num).padStart(2, "0")}`;
  return `/courses/red-level-1/lessons/red-${courseNum}`;
}

export default async function LessonEditorPage({ params }: Props) {
  const session = await requireAdminPageSession();
  const { lessonId } = await params;

  const filePath = lessonFilePath(lessonId);
  if (!filePath) notFound();

  let content = "";
  try {
    content = await readFile(filePath, "utf8");
  } catch {
    notFound();
  }

  const previewUrl = publicLessonUrl(lessonId);

  return (
    <LessonEditorClient
      lessonId={lessonId}
      initialContent={content}
      filePath={filePath.replace(process.cwd(), "")}
      previewUrl={previewUrl}
      editorEmail={session.email}
    />
  );
}
