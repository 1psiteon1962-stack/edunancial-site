import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import {
  importPublishedLessonTranslations,
  type PublishedLessonTranslationImportRecord,
} from "@/lib/curriculum/authoritative-published";
import { revalidatePublishedCurriculumRoutes } from "@/lib/curriculum/revalidate";

const LOCALE_PATTERN = /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/u;

function parseRecords(
  payload: unknown,
): { records: PublishedLessonTranslationImportRecord[]; errors: string[] } {
  const body =
    payload && typeof payload === "object" && Array.isArray((payload as { records?: unknown[] }).records)
      ? (payload as { records: unknown[] }).records
      : payload;

  if (!Array.isArray(body)) {
    return {
      records: [],
      errors: ["Payload must be an array of records or an object with a records array"],
    };
  }

  const errors: string[] = [];
  const records: PublishedLessonTranslationImportRecord[] = [];

  body.forEach((entry, index) => {
    if (!entry || typeof entry !== "object") {
      errors.push(`records[${index}] must be an object`);
      return;
    }

    const record = entry as Record<string, unknown>;
    const lessonId = typeof record.lessonId === "string" ? record.lessonId.trim() : "";
    const locale = typeof record.locale === "string" ? record.locale.trim() : "";
    const title = record.title;
    const summary = record.summary;
    const bodyContent = record.body;

    if (!lessonId) {
      errors.push(`records[${index}].lessonId is required`);
    }
    if (!locale) {
      errors.push(`records[${index}].locale is required`);
    } else if (!LOCALE_PATTERN.test(locale)) {
      errors.push(`records[${index}].locale is invalid`);
    }

    const hasTitle = typeof title === "string";
    const hasSummary = typeof summary === "string";
    const hasBody = typeof bodyContent === "string";

    if (!hasTitle && !hasSummary && !hasBody) {
      errors.push(`records[${index}] must include at least one of title, summary, or body`);
    }
    if (title !== undefined && !hasTitle) {
      errors.push(`records[${index}].title must be a string when provided`);
    }
    if (summary !== undefined && !hasSummary) {
      errors.push(`records[${index}].summary must be a string when provided`);
    }
    if (bodyContent !== undefined && !hasBody) {
      errors.push(`records[${index}].body must be a string when provided`);
    }

    if (lessonId && locale && (hasTitle || hasSummary || hasBody)) {
      records.push({
        lessonId,
        locale,
        ...(hasTitle ? { title: title as string } : {}),
        ...(hasSummary ? { summary: summary as string } : {}),
        ...(hasBody ? { body: bodyContent as string } : {}),
      });
    }
  });

  return { records, errors };
}

export async function POST(request: Request) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const payload = await request.json().catch(() => null);
  if (!payload) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { records, errors } = parseRecords(payload);
  if (errors.length > 0) {
    return NextResponse.json({ error: "Invalid translation import payload", errors }, { status: 400 });
  }

  const result = await importPublishedLessonTranslations(records);
  if (result.missingLessonIds.length > 0) {
    return NextResponse.json(
      {
        error: "One or more lesson IDs were not found in published curriculum state",
        missingLessonIds: result.missingLessonIds,
      },
      { status: 404 },
    );
  }

  await revalidatePublishedCurriculumRoutes();

  return NextResponse.json({
    ok: true,
    updatedRecords: result.updatedRecords,
    updatedLessonIds: result.updatedLessonIds,
  });
}
