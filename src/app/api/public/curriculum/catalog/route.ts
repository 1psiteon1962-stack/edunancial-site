import { NextResponse } from "next/server";

import { getPublishedCourses } from "@/lib/curriculum/authoritative-published";
import { normalizeLanguageCode } from "@/lib/international/languages";
import { LANGUAGE_COOKIE_NAME } from "@/lib/international/preferences";

export const dynamic = "force-dynamic";

const CATEGORY_COLORS: Record<string, string> = {
  "Real Estate": "bg-red-800 text-white",
  "Paper Assets": "bg-slate-200 text-slate-900",
  Business: "bg-blue-800 text-white",
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const queryLanguage = url.searchParams.get("lang");
  const cookieMatch = request.headers
    .get("cookie")
    ?.match(new RegExp(`(?:^|;\\s*)${LANGUAGE_COOKIE_NAME}=([^;]+)`, "u"));
  const cookieLanguage = cookieMatch?.[1] ? decodeURIComponent(cookieMatch[1]) : null;
  const language = normalizeLanguageCode(queryLanguage || cookieLanguage || "en-US");

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

  return NextResponse.json(
    {
      language,
      courseList,
      lessonList: lessons,
      quizList: [],
      courses: Object.fromEntries(courseList.map((course) => [course.id, course])),
      lessons: Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson])),
      quizzes: {},
      categories,
      categoryColors: CATEGORY_COLORS,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
