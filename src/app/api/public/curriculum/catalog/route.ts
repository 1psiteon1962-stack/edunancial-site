import { NextResponse } from "next/server";
import { after } from "next/server";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import { unstable_cache } from "next/cache";

import { getPublishedCourses } from "@/lib/curriculum/authoritative-published";
import { resolveRequestLanguage } from "@/lib/international/server";

export const dynamic = "force-dynamic";

const CATEGORY_COLORS: Record<string, string> = {
  "Real Estate": "bg-red-800 text-white",
  "Paper Assets": "bg-slate-200 text-slate-900",
  Business: "bg-blue-800 text-white",
};

const getCachedCatalog = unstable_cache(async (language: string) => {
  return buildCatalog(language);
}, ["public-curriculum-catalog-v1"], { revalidate: 300, tags: ["published-curriculum"] });

export async function GET(request: Request) {
  const url = new URL(request.url);
  const queryLanguage = url.searchParams.get("lang");
  const language = resolveRequestLanguage({
    explicitLocale: queryLanguage,
    cookieHeader: request.headers.get("cookie"),
    acceptLanguageHeader: request.headers.get("accept-language"),
  });

  // Persistent public-only catalog snapshots survive serverless cold starts.
  // A fresh snapshot avoids rebuilding thousands of lesson records per request.
  const snapshotKey = `published/catalog-snapshots/v1/${encodeURIComponent(language)}.json`;
  const stored = await getAdminContentStorage().readBinary(snapshotKey).catch(() => null);
  let snapshot: { builtAt: number; data: Awaited<ReturnType<typeof buildCatalog>> } | null = null;
  if (stored) {
    try {
      const parsed = JSON.parse(stored.toString("utf8")) as typeof snapshot;
      if (parsed && Number.isFinite(parsed.builtAt) && parsed.data?.language === language) snapshot = parsed;
    } catch { /* Rebuild invalid snapshots instead of exposing malformed content. */ }
  }
  const age = snapshot ? Date.now() - snapshot.builtAt : Infinity;
  if (snapshot && age >= 0 && age < 5 * 60_000) return catalogResponse(snapshot.data);
  if (snapshot && age >= 0 && age < 24 * 60 * 60_000) {
    // Serve a last-known-good snapshot while refreshing it off the request path.
    after(async () => {
      try {
        const data = await getCachedCatalog(language);
        await getAdminContentStorage().saveBinary(snapshotKey, Buffer.from(JSON.stringify({ builtAt: Date.now(), data })), "application/json");
      } catch (error) { console.error("[catalog] background refresh failed", error); }
    });
    return catalogResponse(snapshot.data);
  }
  const data = await getCachedCatalog(language);
  await getAdminContentStorage().saveBinary(snapshotKey, Buffer.from(JSON.stringify({ builtAt: Date.now(), data })), "application/json").catch((error) => {
    console.error("[catalog] snapshot persistence failed", error);
  });
  return catalogResponse(data);
}

function catalogResponse(data: Awaited<ReturnType<typeof buildCatalog>>) {
  // The locale may be selected from cookies or Accept-Language, not just the URL.
  // Never let a shared CDN cache serve one visitor\u0027s locale to another.
  // The server-side unstable_cache remains keyed by the resolved language.
  return NextResponse.json(data, { headers: { "Cache-Control": "private, no-store", Vary: "Cookie, Accept-Language" } });
}

async function buildCatalog(language: string) {
  const courses = await getPublishedCourses(language);
  const courseList = courses.map((course) => ({
    id: course.id,
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    category: course.category,
    difficulty: course.difficulty,
    color: course.color,
    isFree: course.isFree,
    isFeatured: course.isFeatured,
    tags: [course.category],
    lessons: course.lessons.map((lesson) => lesson.id),
  }));
  const lessons = courses.flatMap((course) =>
    course.lessons.map((lesson) => ({
      id: lesson.id,
      courseId: course.id,
      title: lesson.title,
      description: lesson.summary,
      duration: lesson.metadata.duration ?? "—",
      notes: lesson.metadata.notes ?? "",
      transcript: lesson.metadata.transcript ?? null,
      downloadUrl: lesson.metadata.downloadUrl ?? null,
      quizId: lesson.metadata.quizId ?? null,
      videoUrl: lesson.metadata.videoUrl ?? "",
    })),
  );
  const categories = [...new Set(courseList.map((course) => course.category))];

  return {
      language,
      courseList,
      lessonList: lessons,
      quizList: [],
      courses: Object.fromEntries(courseList.map((course) => [course.id, course])),
      lessons: Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson])),
      quizzes: {},
      categories,
      categoryColors: CATEGORY_COLORS,
  };
}
