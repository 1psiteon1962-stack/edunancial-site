import Link from "next/link";
import { notFound } from "next/navigation";
import { courses, lessons, instructors } from "@/data/course-platform";

interface Props {
  params: Promise<{ courseId: string }>;
}

export async function generateStaticParams() {
  return Object.keys(courses).map((id) => ({ courseId: id }));
}

export async function generateMetadata({ params }: Props) {
  const { courseId } = await params;
  const course = courses[courseId];
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
  const course = courses[courseId];
  if (!course) notFound();

  const instructor = instructors[course.instructor];
  const courseLessons = course.lessons.map((id) => lessons[id]).filter(Boolean);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      {/* Hero */}
      <section className={`border-b border-slate-800 bg-gradient-to-br from-slate-900 to-[#08101f]`}>
        <div className="mx-auto max-w-7xl px-6 py-20 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
              <Link href="/course-catalog" className="hover:text-white">Course Catalog</Link>
              <span>/</span>
              <span className="text-slate-200">{course.category}</span>
            </nav>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${difficultyBadge[course.difficulty]}`}>
                {course.difficulty}
              </span>
              {course.isFree && (
                <span className="rounded-full bg-green-900 text-green-300 px-3 py-1 text-xs font-bold">FREE</span>
              )}
              {course.isFeatured && (
                <span className="rounded-full bg-yellow-900 text-yellow-300 px-3 py-1 text-xs font-bold">⭐ Featured</span>
              )}
            </div>

            <h1 className="text-4xl font-black md:text-5xl leading-tight">{course.title}</h1>
            <p className="mt-4 text-xl text-slate-300">{course.subtitle}</p>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <span className="text-yellow-400 font-bold">{course.rating}</span>
                <span className="text-yellow-400">{"★".repeat(Math.round(course.rating))}</span>
                <span className="text-slate-500">({course.reviewCount} reviews)</span>
              </span>
              <span>👥 {course.enrolledCount.toLocaleString()} students</span>
              <span>📚 {courseLessons.length} lessons</span>
              <span>⏱ {course.totalDuration}</span>
            </div>

            {/* Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  {tag}
                </span>
              ))}
            </div>

            {/* Instructor preview */}
            {instructor && (
              <div className="mt-8 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center text-xl font-black">
                  {instructor.name[0]}
                </div>
                <div>
                  <p className="text-sm text-slate-400">Instructor</p>
                  <p className="font-bold">{instructor.name}</p>
                  <p className="text-sm text-slate-400">{instructor.title}</p>
                </div>
              </div>
            )}
          </div>

          {/* Enroll card */}
          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-8 h-fit lg:sticky lg:top-24">
            <div className={`h-1.5 w-full rounded-full mb-6 ${course.color.startsWith("bg-slate-2") ? "bg-slate-400" : course.color}`} />
            <p className="text-3xl font-black">{course.isFree ? "Free" : `$${course.price ?? 97}`}</p>
            <Link
              href={`/courses/${course.id}/lessons/${course.lessons[0]}`}
              className="mt-6 block w-full rounded-xl bg-yellow-500 py-4 text-center font-black text-black text-lg hover:bg-yellow-400 transition"
            >
              {course.isFree ? "Start Free Course" : "Enroll Now"}
            </Link>
            <Link
              href="/my-courses"
              className="mt-3 block w-full rounded-xl border border-slate-600 py-3 text-center font-bold text-slate-300 hover:bg-slate-800 transition"
            >
              View My Courses
            </Link>
            <ul className="mt-8 space-y-3 text-sm text-slate-300">
              <li>✅ {courseLessons.length} on-demand lessons</li>
              <li>✅ {course.totalDuration} total content</li>
              <li>✅ Downloadable resources</li>
              <li>✅ Certificate of completion</li>
              <li>✅ Lifetime access</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-12">
          {/* About */}
          <section>
            <h2 className="text-2xl font-black mb-4">About This Course</h2>
            <p className="text-slate-300 leading-relaxed text-lg">{course.description}</p>
          </section>

          {/* Lessons */}
          <section>
            <h2 className="text-2xl font-black mb-6">Course Curriculum</h2>
            <p className="text-slate-400 mb-6 text-sm">
              {courseLessons.length} lessons · {course.totalDuration}
            </p>
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
                    <p className="text-slate-400 text-xs mt-0.5">{lesson.description.slice(0, 80)}…</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {lesson.quizId && (
                      <span className="rounded-full bg-purple-900 text-purple-300 px-2 py-0.5 text-xs">Quiz</span>
                    )}
                    {lesson.downloadUrl && (
                      <span className="rounded-full bg-blue-900 text-blue-300 px-2 py-0.5 text-xs">PDF</span>
                    )}
                    <span className="text-slate-400 text-sm">{lesson.duration}</span>
                    <span className="text-slate-500">▶</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Instructor */}
          {instructor && (
            <section>
              <h2 className="text-2xl font-black mb-6">Your Instructor</h2>
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8">
                <div className="flex items-start gap-6">
                  <div className="h-20 w-20 rounded-full bg-slate-700 flex items-center justify-center text-3xl font-black flex-shrink-0">
                    {instructor.name[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-black">{instructor.name}</h3>
                    <p className="text-yellow-400 font-medium mt-1">{instructor.title}</p>
                    <div className="flex gap-6 mt-3 text-sm text-slate-400">
                      <span>⭐ {instructor.rating} Rating</span>
                      <span>👥 {instructor.students.toLocaleString()} Students</span>
                      <span>📚 {instructor.courses.length} Course{instructor.courses.length !== 1 ? "s" : ""}</span>
                    </div>
                    <p className="mt-4 text-slate-300 leading-relaxed">{instructor.bio}</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-black text-lg mb-4">Related Courses</h3>
            {Object.values(courses)
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
              Browse All Courses →
            </Link>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-black text-lg mb-4">Certificate</h3>
            <p className="text-sm text-slate-300">Complete all lessons and pass the final quiz to earn your certificate of completion.</p>
            <Link href="/certificates" className="mt-4 block text-center text-sm text-yellow-400 hover:text-yellow-300">
              View Certificate Gallery →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
