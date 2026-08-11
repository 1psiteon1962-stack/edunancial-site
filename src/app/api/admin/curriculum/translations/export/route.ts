import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { exportPublishedLessonTranslations } from "@/lib/curriculum/authoritative-published";

const LESSON_ID_PATTERN = /^[A-Za-z]+-L[1-9]\d*-\d{3}$/u;
// Accepts: track code (RED), track-level (RED-L1), or level-only (L1)
const PREFIX_PART_PATTERN = /^(?:[A-Za-z]+-)?L[1-9]\d*$|^[A-Za-z]+(?:-L[1-9]\d*)?$/u;

function parseExportQuery(request: Request): { prefixes?: string[]; lessonIds?: string[]; errors: string[] } {
  const url = new URL(request.url);
  const rawPrefix = url.searchParams.get("prefix");
  const rawLessonIds = url.searchParams.getAll("lessonId");
  const errors: string[] = [];

  let prefixes: string[] | undefined;
  if (rawPrefix !== null) {
    const parts = rawPrefix.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length === 0) {
      errors.push("prefix must not be empty when provided");
    } else if (parts.some((p) => !PREFIX_PART_PATTERN.test(p))) {
      errors.push("prefix must be a track code, track-level prefix, or level prefix such as RED, RED-L1, or L1");
    } else {
      prefixes = [...new Set(parts.map((p) => p.toUpperCase()))];
    }
  }

  const lessonIds = rawLessonIds.map((lessonId) => lessonId.trim());
  if (lessonIds.some((lessonId) => !lessonId)) {
    errors.push("lessonId must not be empty when provided");
  }
  if (lessonIds.some((lessonId) => lessonId && !LESSON_ID_PATTERN.test(lessonId))) {
    errors.push("lessonId must use canonical lesson format such as RED-L1-001");
  }

  return {
    ...(prefixes ? { prefixes } : {}),
    ...(lessonIds.length > 0 ? { lessonIds: [...new Set(lessonIds.map((lessonId) => lessonId.toUpperCase()).filter(Boolean))] } : {}),
    errors,
  };
}

export async function GET(request: Request) {
  const auth = await requireAdminApiSession(request);
  if (!auth.ok) return auth.response;

  const { prefixes, lessonIds, errors } = parseExportQuery(request);
  if (errors.length > 0) {
    return NextResponse.json({ error: "Invalid curriculum translation export query", errors }, { status: 400 });
  }

  return NextResponse.json(
    await exportPublishedLessonTranslations({ prefixes, lessonIds }),
  );
}
