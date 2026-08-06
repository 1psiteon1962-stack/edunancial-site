import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  courses,
  getCoursePrimaryHref,
  getLocalizedCourseMap,
  getLocalizedLessonMap,
  lessons,
} from "@/lib/curriculum/production-catalog";
import { translate } from "@/lib/international/i18n";
import { normalizeLanguageCode } from "@/lib/international/languages";
import { LANGUAGE_COOKIE_NAME } from "@/lib/international/preferences";

interface Props {
  params: Promise<{ courseId: string }>;
}

export async function generateStaticParams() {
  return Object.keys(courses).map((id) => ({ courseId: id }));
}

export async function generateMetadata({ params }: Props) {
  const { courseId } = await params;
  const cookieStore = await cookies();
  const language = normalizeLanguageCode(cookieStore.get(LANGUAGE_COOKIE_NAME)?.value ?? "en-US");
  const course = getLocalizedCourseMap(language)[courseId] ?? courses[courseId];
  if (!course) return { title: "Course Not Found" };
  return { title: `${course.title} | Edunancial` };
}

const difficultyBadge: Record<string, string> = {
  Beginner: "bg-green-800 text-green-300",
  Intermediate: "bg-yellow-800 text-yellow-300",
  Advanced: "bg-red-900 text-red-300",
};

export default async function CourseDetailPage({ params }: Props) {
  const { courseId } = await params;
  const cookieStore = await cookies();
  const language = normalizeLanguageCode(cookieStore.get(LANGUAGE_COOKIE_NAME)?.value ?? "en-US");
  const t = (key: string, values?: Record<string, string | number>) => translate(language, key, values);
  const localizedCourses = getLocalizedCourseMap(language);
  const localizedLessons = getLocalizedLessonMap(language);
  const course = localizedCourses[courseId] ?? courses[courseId];
  if (!course) notFound();

  const courseLessons = course.lessons.map((id) => localizedLessons[id] ?? lessons[id]).filter(Boolean);
  const hasPublishedLessons = courseLessons.length > 0;
  const primaryHref = hasPublishedLessons
    ? getCoursePrimaryHref(course)
    : `/curriculum/${course.id}`;

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      {/* Hero */}
      <section className={`border-b border-slate-800 bg-gradient-to-br from-slate-900 to-[#08101f]`}>
        <div className="mx-auto max-w-7xl px-6 py-20 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
              <Link href="/course-catalog" className="hover:text-white">{t("courseDetail.catalogLink")}</Link>
              <span>/</span>
              <span className="text-slate-200">{course.category}</span>
            </nav>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${difficultyBadge[course.difficulty]}`}>
                {course.difficulty}
              </span>
              {course.isFree && (
                <span className="rounded-full bg-green-900 text-green-300 px-3 py-1 text-xs font-bold">{t("courseDetail.freeBadge")}</span>
              )}
              {course.isFeatured && (
                <span className="rounded-full bg-yellow-900 text-yellow-300 px-3 py-1 text-xs font-bold">⭐ {t("courseDetail.featuredBadge")}</span>
              )}
            </div>

            <h1 className="text-4xl font-black md:text-5xl leading-tight">{course.title}</h1>
            <p className="mt-4 text-xl text-slate-300">{course.subtitle}</p>

            {/* Stats — only show real data */}
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-300">
              <span>📚 {t(courseLessons.length === 1 ? "courseDetail.lessonCount_one" : "courseDetail.lessonCount_other", { count: courseLessons.length })}</span>
            </div>

            {/* Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Enroll card */}
          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-8 h-fit lg:sticky lg:top-24">
            <div className={`h-1.5 w-full rounded-full mb-6 ${course.color.startsWith("bg-slate-2") ? "bg-slate-400" : course.color}`} />
            <p className="text-2xl font-black">{t("courseDetail.includedWithMembership")}</p>
            <Link
              href={primaryHref}
              className="mt-6 block w-full rounded-xl bg-yellow-500 py-4 text-center font-black text-black text-lg hover:bg-yellow-400 transition"
            >
              {hasPublishedLessons
                ? (course.isFree ? t("courseDetail.startFreeCourse") : t("courseDetail.enrollNow"))
                : t("courseDetail.viewActiveTrack")}
            </Link>
            <Link
              href="/my-courses"
              className="mt-3 block w-full rounded-xl border border-slate-600 py-3 text-center font-bold text-slate-300 hover:bg-slate-800 transition"
            >
              {t("courseDetail.viewMyCourses")}
            </Link>
            <ul className="mt-8 space-y-3 text-sm text-slate-300">
              <li>✅ {t("courseDetail.checklist.trackActive")}</li>
              <li>✅ {t(courseLessons.length === 1 ? "courseDetail.lessonCountPublished_one" : "courseDetail.lessonCountPublished_other", { count: courseLessons.length })}</li>
              <li>✅ {t("courseDetail.checklist.newLessons")}</li>
              <li>✅ {t("courseDetail.checklist.membershipAccess")}</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-12">
          {/* About */}
          <section>
            <h2 className="text-2xl font-black mb-4">{t("courseDetail.aboutTitle")}</h2>
            <p className="text-slate-300 leading-relaxed text-lg">{course.description}</p>
          </section>

          {/* Lessons */}
          <section>
            <h2 className="text-2xl font-black mb-6">{t("courseDetail.curriculumTitle")}</h2>
            <p className="text-slate-400 mb-6 text-sm">
              {t(courseLessons.length === 1 ? "courseDetail.lessonCount_one" : "courseDetail.lessonCount_other", { count: courseLessons.length })}
            </p>
            {hasPublishedLessons ? (
              <div className="space-y-3">
                {courseLessons.map((lesson, idx) => (
                  <Link
                    key={lesson.id}
                    href={`/courses/${course.id}/lessons/${lesson.id}`}
                    className="flex items-center gap-4 rounded-xl bg-slate-900 border border-slate-800 px-5 py-4 hover:border-slate-600 transition group"
                  >
                    <div className="h-9 w-9 rounded-full bg-slate-800 group-hover:bg-blue-700 flex items-center justify-center text-sm font-bold transition flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold group-hover:text-yellow-400 transition truncate">{lesson.title}</p>
                      {lesson.description && (
                        <p className="text-slate-400 text-xs mt-0.5">{lesson.description.slice(0, 80)}…</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {lesson.quizId && (
                        <span className="rounded-full bg-purple-900 text-purple-300 px-2 py-0.5 text-xs">{t("courseDetail.quizBadge")}</span>
                      )}
                      {lesson.downloadUrl && (
                        <span className="rounded-full bg-blue-900 text-blue-300 px-2 py-0.5 text-xs">{t("courseDetail.pdfBadge")}</span>
                      )}
                      <span className="text-slate-400 text-sm">{lesson.duration}</span>
                      <span className="text-slate-500">▶</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center">
                <p className="text-2xl font-black text-slate-200">{t("curriculumLevel.comingSoonTitle")}</p>
                <p className="mt-3 text-slate-400">
                  {t("courseDetail.comingSoonBody", { courseTitle: course.title })}
                </p>
                <Link
                  href={`/curriculum/${course.id}`}
                  className="mt-6 inline-block rounded-xl border border-slate-700 px-6 py-3 font-bold text-slate-300 hover:bg-slate-800 transition"
                >
                  {t("courseDetail.browseTrackStructure")}
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-black text-lg mb-4">{t("courseDetail.relatedCourses")}</h3>
            {Object.values(localizedCourses)
              .filter((c) => c.id !== course.id && c.category === course.category)
              .slice(0, 3)
              .map((related) => (
                <Link
                  key={related.id}
                  href={`/courses/${related.id}`}
                  className="flex items-center gap-3 py-3 border-b border-slate-800 last:border-0 hover:text-yellow-400 transition"
                >
                  <div className={`h-3 w-3 rounded-full flex-shrink-0 ${related.color.startsWith("bg-slate-2") ? "bg-slate-400" : related.color}`} />
                  <span className="text-sm font-medium">{related.title}</span>
                </Link>
              ))}
            <Link href="/course-catalog" className="mt-4 block text-center text-sm text-blue-400 hover:text-blue-300">
              {t("courseDetail.browseAllCourses")} →
            </Link>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-black text-lg mb-4">{t("courseDetail.certificateTitle")}</h3>
            <p className="text-sm text-slate-300">{t("courseDetail.certificateBody")}</p>
            <Link href="/certificates" className="mt-4 block text-center text-sm text-yellow-400 hover:text-yellow-300">
              {t("courseDetail.certificateLink")} →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
