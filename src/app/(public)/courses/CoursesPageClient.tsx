"use client";

import Link from "next/link";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { courseList } from "@/data/course-platform";

const featured = courseList.filter((course) => course.isFeatured);

function FeaturedGrid({ heading, linkLabel }: { heading: string; linkLabel: string }) {
  return (
    <div className="mt-24">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-black">{heading}</h2>
        <Link href="/course-catalog" className="text-sm font-bold text-yellow-400 hover:text-yellow-300">
          {linkLabel}
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:border-slate-600"
          >
            <div className={`h-1.5 w-full ${course.color.startsWith("bg-slate-2") ? "bg-slate-300" : course.color}`} />
            <div className="p-5">
              {course.isFree && (
                <span className="mb-3 inline-block rounded-full bg-green-900 px-2 py-0.5 text-xs font-bold text-green-300">
                  FREE
                </span>
              )}
              <h3 className="font-black transition group-hover:text-yellow-400">{course.title}</h3>
              <p className="mt-2 text-xs text-slate-400">
                {course.category} · {course.difficulty}
              </p>
              <p className="mt-3 text-xs text-slate-500">📚 {course.lessons.length} lessons · ⏱ {course.totalDuration}</p>
              <div className="mt-3 flex items-center gap-1 text-xs">
                <span className="text-yellow-400">{course.rating}</span>
                <span className="text-yellow-400">★</span>
                <span className="text-slate-500">({course.reviewCount})</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function CoursesPageClient() {
  const { effectiveLanguage, t } = useInternationalPreferences();
  const tracks = ["red", "white", "blue"] as const;
  const noteBody = t("courses.note.body");
  const showNote = noteBody.length > 0;
  const language = effectiveLanguage === "es" ? "es" : "default";
  const trackStyles = {
    red: "bg-red-700",
    white: "bg-slate-200 text-slate-900",
    blue: "bg-blue-700",
  } as const;
  const primaryHref = language === "es" ? "/membership" : "/course-catalog";
  const secondaryHref = language === "es" ? "/course-progress" : "/my-courses";

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">{t("courses.label")}</p>
        <h1 className="mt-4 text-5xl font-black md:text-7xl">{t("courses.title")}</h1>
        <p className="mt-6 max-w-3xl text-xl leading-relaxed text-slate-300">{t("courses.intro")}</p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {tracks.map((track) => (
            <Link
              key={track}
              href={`/courses/${track}`}
              className={`${trackStyles[track]} rounded-2xl p-10 transition hover:opacity-90`}
            >
              <h2 className="text-5xl font-black">{track.toUpperCase()}</h2>
              <h3 className="mt-6 text-2xl font-bold">{t(`courses.track.${track}.title`)}</h3>
              <p className="mt-4 text-lg opacity-80">{t(`courses.track.${track}.description`)}</p>
              <p className="mt-8 text-sm font-bold">{t("courses.trackLabel")}</p>
            </Link>
          ))}
        </div>

        {showNote ? (
          <div className="mt-16 rounded-2xl border border-blue-400/30 bg-blue-500/10 p-8 text-slate-200">
            <h2 className="text-2xl font-black text-white">{t("courses.note.title")}</h2>
            <p className="mt-4 max-w-3xl leading-8">{noteBody}</p>
          </div>
        ) : (
          <FeaturedGrid heading={t("courses.featuredHeading")} linkLabel={t("courses.featuredLink")} />
        )}

        <div className="mt-20 flex flex-col gap-4 sm:flex-row">
          <Link href={primaryHref} className="rounded-xl bg-yellow-500 px-8 py-4 text-center font-black text-black transition hover:bg-yellow-400">
            {t("courses.primaryLabel")}
          </Link>
          <Link href={secondaryHref} className="rounded-xl border border-slate-600 px-8 py-4 text-center font-bold text-slate-300 transition hover:bg-slate-800">
            {t("courses.secondaryLabel")}
          </Link>
        </div>
      </section>
    </main>
  );
}
