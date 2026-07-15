import Link from "next/link";

import BilingualContent from "@/components/international/BilingualContent";
import { courseList } from "@/data/course-platform";

export const metadata = {
  title: "Course Progress | Edunancial",
};

const mockProgress: Record<string, number[]> = {
  "red-real-estate": [0, 1],
  "white-paper-assets": [0, 1, 2, 3],
  "blue-business": [0],
  "financial-foundations": [0, 1, 2, 3, 4],
};

function ProgressLayout({
  label,
  title,
  overallLabel,
  lessonsLabel,
  breakdownLabel,
  completeTemplate,
  certificateLabel,
  continueLabel,
  primaryLabel,
  secondaryLabel,
}: {
  label: string;
  title: string;
  overallLabel: string;
  lessonsLabel: (done: number, total: number) => string;
  breakdownLabel: string;
  completeTemplate: (done: number, total: number) => string;
  certificateLabel: string;
  continueLabel: string;
  primaryLabel: string;
  secondaryLabel: string;
}) {
  const progressData = courseList.map((course) => {
    const done = (mockProgress[course.id] ?? []).length;
    const pct = Math.round((done / course.lessons.length) * 100);
    return { ...course, done, pct };
  });

  const enrolled = progressData.filter((c) => c.pct > 0);
  const totalLessons = enrolled.reduce((s, c) => s + c.lessons.length, 0);
  const totalDone = enrolled.reduce((s, c) => s + c.done, 0);
  const overallPct = totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">{label}</p>
        <h1 className="mt-4 text-5xl font-black">{title}</h1>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-sm text-slate-400">{overallLabel}</p>
              <p className="mt-1 text-4xl font-black text-blue-400">{overallPct}%</p>
            </div>
            <p className="text-sm text-slate-400">{lessonsLabel(totalDone, totalLessons)}</p>
          </div>
          <div className="h-4 w-full rounded-full bg-slate-800">
            <div className="h-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all" style={{ width: `${overallPct}%` }} />
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <h2 className="text-2xl font-black">{breakdownLabel}</h2>
          {enrolled.map((course) => (
            <div key={course.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black">{course.title}</h3>
                  <p className="text-sm text-slate-400">{course.category} · {course.difficulty}</p>
                </div>
                <span className={`text-xl font-black ${course.pct === 100 ? "text-green-400" : "text-blue-400"}`}>{course.pct}%</span>
              </div>
              <div className="mb-3 h-3 w-full rounded-full bg-slate-800">
                <div className={`h-3 rounded-full transition-all ${course.pct === 100 ? "bg-green-500" : "bg-blue-500"}`} style={{ width: `${course.pct}%` }} />
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{completeTemplate(course.done, course.lessons.length)}</span>
                {course.pct === 100 ? (
                  <Link href="/my-certificates" className="font-bold text-green-400 hover:text-green-300">
                    ✅ {certificateLabel}
                  </Link>
                ) : (
                  <Link href={`/courses/${course.id}/lessons/${course.lessons[course.done] ?? course.lessons[0]}`} className="font-bold text-yellow-400 hover:text-yellow-300">
                    {continueLabel}
                  </Link>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {course.lessons.map((_, idx) => (
                  <div key={idx} className={`h-2.5 w-2.5 rounded-full ${idx < course.done ? "bg-blue-500" : "bg-slate-700"}`} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link href="/my-courses" className="rounded-xl bg-yellow-500 px-6 py-3 font-black text-black transition hover:bg-yellow-400">
            {primaryLabel}
          </Link>
          <Link href="/course-catalog" className="rounded-xl border border-slate-600 px-6 py-3 font-bold text-slate-300 transition hover:bg-slate-800">
            {secondaryLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function CourseProgressPage() {
  return (
    <BilingualContent
      en={
        <ProgressLayout
          label="PROGRESS TRACKING"
          title="Course Progress"
          overallLabel="Overall Learning Progress"
          lessonsLabel={(done, total) => `${done} / ${total} lessons`}
          breakdownLabel="Course Breakdown"
          completeTemplate={(done, total) => `${done} of ${total} lessons complete`}
          certificateLabel="Certificate Earned"
          continueLabel="Continue →"
          primaryLabel="My Courses"
          secondaryLabel="Browse More Courses"
        />
      }
      es={
        <ProgressLayout
          label="SEGUIMIENTO DE PROGRESO"
          title="Progreso del curso"
          overallLabel="Progreso general de aprendizaje"
          lessonsLabel={(done, total) => `${done} / ${total} lecciones`}
          breakdownLabel="Desglose por curso"
          completeTemplate={(done, total) => `${done} de ${total} lecciones completas`}
          certificateLabel="Certificado obtenido"
          continueLabel="Continuar →"
          primaryLabel="Mis cursos"
          secondaryLabel="Explorar más cursos"
        />
      }
      fr={
        <ProgressLayout
          label="SUIVI DE PROGRESSION"
          title="Progression des cours"
          overallLabel="Progression globale d'apprentissage"
          lessonsLabel={(done, total) => `${done} / ${total} leçons`}
          breakdownLabel="Répartition par cours"
          completeTemplate={(done, total) => `${done} sur ${total} leçons terminées`}
          certificateLabel="Certificat obtenu"
          continueLabel="Continuer →"
          primaryLabel="Mes cours"
          secondaryLabel="Parcourir plus de cours"
        />
      }
    />
  );
}
