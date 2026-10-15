import { NextResponse } from "next/server";
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

  const data = await getCachedCatalog(language);
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
