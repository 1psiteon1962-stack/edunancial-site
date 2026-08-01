import { notFound, redirect } from "next/navigation";

import { courseList } from "@/lib/curriculum/production-catalog";
import { getLessonContent } from "@/lib/curriculum/reader";
import { getCanonicalLessonHref } from "@/lib/curriculum/routes";

interface Props {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export async function generateStaticParams() {
  return courseList.flatMap((course) =>
    course.lessons.map((lessonId) => ({ courseId: course.id, lessonId }))
  );
}

export async function generateMetadata({ params }: Props) {
  const { courseId, lessonId } = await params;
  const content = getLessonContent(lessonId.toUpperCase());
  if (!content) return { title: "Lesson Not Found" };
  return {
    title: `${content.meta.title} | ${content.meta.trackName} | Edunancial`,
    description: content.meta.summary,
  };
}

export default async function LessonPage({ params }: Props) {
  const { courseId, lessonId } = await params;
  const canonicalHref = getCanonicalLessonHref(courseId, lessonId);
  if (canonicalHref !== `/courses/${courseId}/lessons/${lessonId}`) {
    redirect(canonicalHref);
  }

  notFound();
}
