import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import {
  importPublishedLessonTranslations,
  type PublishedLessonTranslationImportRecord,
} from "@/lib/curriculum/authoritative-published";
import {
  canonicalizeGlobalLocale,
  getGlobalLocale,
} from "@/lib/curriculum/global-localization";
import { revalidatePublishedCurriculumRoutes } from "@/lib/curriculum/revalidate";

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
    const lessonId = typeof record.lessonId === "string" ? record.lessonId.trim().toUpperCase() : "";
    const rawLocale = typeof record.locale === "string" ? record.locale.trim() : "";
    const canonicalLocale = rawLocale ? canonicalizeGlobalLocale(rawLocale) : "";
    const registeredLocale = rawLocale ? getGlobalLocale(canonicalLocale) : undefined;
    const title = record.title;
    const summary = record.summary;
    const bodyContent = record.body;

    if (!lessonId) {
      errors.push(`records[${index}].lessonId is required`);
    }
    if (!rawLocale) {
      errors.push(`records[${index}].locale is required`);
    } else if (!registeredLocale) {
      errors.push(`records[${index}].locale must be a registered global locale`);
    } else if (registeredLocale.status !== "active") {
      errors.push(`records[${index}].locale ${canonicalLocale} is not active`);
    }

    const hasTitle = typeof title === "string" && title.trim().length > 0;
    const hasSummary = typeof summary === "string" && summary.trim().length > 0;
    const hasBody = typeof bodyContent === "string" && bodyContent.trim().length > 0;

    if (!hasTitle && !hasSummary && !hasBody) {
      errors.push(`records[${index}] must include at least one non-empty title, summary, or body`);
    }
    if (title !== undefined && typeof title !== "string") {
      errors.push(`records[${index}].title must be a string when provided`);
    }
    if (summary !== undefined && typeof summary !== "string") {
      errors.push(`records[${index}].summary must be a string when provided`);
    }
    if (bodyContent !== undefined && typeof bodyContent !== "string") {
      errors.push(`records[${index}].body must be a string when provided`);
    }

    if (lessonId && registeredLocale && registeredLocale.status === "active" && (hasTitle || hasSummary || hasBody)) {
      records.push({
        lessonId,
        locale: canonicalLocale,
        ...(hasTitle ? { title: (title as string).trim() } : {}),
        ...(hasSummary ? { summary: (summary as string).trim() } : {}),
        ...(hasBody ? { body: (bodyContent as string).trim() } : {}),
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
