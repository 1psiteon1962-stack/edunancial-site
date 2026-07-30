import Link from "next/link";
import { quizList, courses } from "@/lib/curriculum/production-catalog";

export const metadata = {
  title: "Quizzes | Edunancial",
};

export default function QuizzesPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400 text-sm">QUIZZES</p>
        <h1 className="mt-4 text-5xl font-black md:text-6xl">Test Your Knowledge</h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Each quiz reinforces your learning. Pass with 70% or above to unlock your certificate.
        </p>

        <div className="mt-16">
          {quizList.length === 0 ? (
            <div className="rounded-2xl border border-red-800 bg-red-950/30 p-12 text-center">
              <p className="text-4xl">⚠️</p>
              <p className="mt-4 text-2xl font-black text-red-400">No Quizzes Published</p>
              <p className="mt-4 text-slate-300">
                The production curriculum registry contains no quizzes. Quizzes will appear here
                automatically when they are registered in{" "}
                <code className="rounded bg-slate-800 px-2 py-0.5 text-yellow-400">curriculum/registry.json</code>.
              </p>
            </div>
          ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizList.map((quiz) => {
            const course = quiz.courseId ? courses[quiz.courseId] : null;
            return (
              <div key={quiz.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col">
                {course && (
                  <span className={`inline-block self-start rounded-full px-3 py-1 text-xs font-bold mb-4 ${
                    course.color.startsWith("bg-slate-2") ? "bg-slate-300 text-slate-900" : course.color
                  }`}>
                    {course.category}
                  </span>
                )}
                <h2 className="text-xl font-black">{quiz.title}</h2>
                <div className="mt-3 flex gap-4 text-sm text-slate-400">
                  <span>❓ {quiz.questions.length} questions</span>
                  <span>✅ Pass: {quiz.passingScore}%</span>
                </div>
                {course && (
                  <p className="mt-2 text-xs text-slate-500">Course: {course.title}</p>
                )}
                <div className="mt-auto pt-6 flex gap-3">
                  <Link
                    href={`/quizzes/${quiz.id}`}
                    className="flex-1 rounded-xl bg-purple-600 py-3 text-center font-bold text-white hover:bg-purple-500 transition"
                  >
                    Start Quiz
                  </Link>
                  {course && (
                    <Link
                      href={`/courses/${course.id}`}
                      className="rounded-xl border border-slate-600 px-4 py-3 font-bold text-slate-300 hover:bg-slate-800 transition"
                    >
                      Course
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
          </div>
          )}
        </div>
      </section>
    </main>
  );
}
