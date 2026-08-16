import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { clearPublishedTranslations } from "@/lib/curriculum/published-translation-maintenance";
import { revalidatePublishedCurriculumRoutes } from "@/lib/curriculum/revalidate";

const LOCALE_PATTERN = /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/u;
const LESSON_ID_PATTERN = /^[A-Z]+-L[1-9][0-9]*-[0-9]{3}$/u;
const LESSON_PREFIX_PATTERN = /^[A-Z]+-L[1-9][0-9]*-$/u;

export async function POST(request: Request) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const payload = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!payload) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const locale = typeof payload.locale === "string" ? payload.locale.trim() : "";
  const lessonPrefix = typeof payload.lessonPrefix === "string" ? payload.lessonPrefix.trim().toUpperCase() : "";
  const lessonIds = Array.isArray(payload.lessonIds)
    ? payload.lessonIds.filter((value): value is string => typeof value === "string").map((value) => value.trim().toUpperCase())
    : [];

  const errors: string[] = [];
  if (!LOCALE_PATTERN.test(locale)) errors.push("locale is required and must be a valid locale code");
  if (lessonPrefix && !LESSON_PREFIX_PATTERN.test(lessonPrefix)) errors.push("lessonPrefix must look like RED-L1-");
  if (lessonIds.some((id) => !LESSON_ID_PATTERN.test(id))) errors.push("Every lessonId must look like RED-L1-001");
  if (!lessonPrefix && lessonIds.length === 0) errors.push("lessonPrefix or lessonIds is required");
  if (errors.length > 0) return NextResponse.json({ error: "Invalid cleanup request", errors }, { status: 400 });

  const result = await clearPublishedTranslations({
    locale,
    ...(lessonPrefix ? { lessonPrefix } : {}),
    ...(lessonIds.length > 0 ? { lessonIds } : {}),
  });
  await revalidatePublishedCurriculumRoutes();

  return NextResponse.json({ ok: true, ...result });
}
