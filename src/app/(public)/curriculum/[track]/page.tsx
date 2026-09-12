import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { isPublicCurriculumTrack } from "@/lib/curriculum/localization";
import { getPublishedTrack } from "@/lib/curriculum/public-safe";
import { getServerTranslator } from "@/lib/international/server";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ track: string }>;
}

const LEVEL_NAME_KEYS = [
  "curriculum.level1.name",
  "curriculum.level2.name",
  "curriculum.level3.name",
  "curriculum.level4.name",
  "curriculum.level5.name",
] as const;

const ACCENT: Record<string, string> = {
  RED: "from-red-950 via-red-900 to-slate-950",
  WHITE: "from-slate-900 via-slate-800 to-slate-950",
  BLUE: "from-blue-950 via-blue-900 to-slate-950",
  GREEN: "from-emerald-950 via-emerald-900 to-slate-950",
  GOLD: "from-amber-950 via-amber-900 to-slate-950",
  PURPLE: "from-purple-950 via-purple-900 to-slate-950",
  ORANGE: "from-orange-950 via-orange-900 to-slate-950",
  BLACK: "from-slate-950 via-slate-900 to-black",
};

function translatedOr(t: (key: string, values?: Record<string, string | number>) => string, key: string, fallback: string, values?: Record<string, string | number>) {
  const value = t(key, values);
  return value === key ? fallback : value;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track: raw } = await params;
  const { language } = await getServerTranslator();
  const track = await getPublishedTrack(raw.toUpperCase(), language);
  return { title: track ? `${track.name} (${track.code}) | Edunancial` : "Track Not Found | Edunancial" };
}

export default async function TrackPage({ params }: Props) {
  const { track: raw } = await params;
  const code = raw.toUpperCase();
  if (!isPublicCurriculumTrack(code)) notFound();

  const { language, t } = await getServerTranslator();
  const track = await getPublishedTrack(code, language);
  if (!track) notFound();

  const curriculum = translatedOr(t, "nav.curriculum", "Curriculum");
  const trackLabel = translatedOr(t, "curriculum.trackLabel", "Track");
  const overview = translatedOr(t, "curriculum.tab.overview", "Overview");
  const lessons = translatedOr(t, "curriculum.tab.lessons", "Lessons");
  const caseStudies = translatedOr(t, "curriculum.tab.caseStudies", "Case Studies");
  const resources = translatedOr(t, "curriculum.tab.resources", "Resources");
  const flashcards = translatedOr(t, "curriculum.tab.flashcards", "Flashcards");
  const whatYouLearn = translatedOr(t, "curriculum.whatYouLearn.title", "What You’ll Learn");
  const whatYouLearnBody = translatedOr(t, "curriculum.whatYouLearn.body", "Build knowledge across five structured levels, then apply it to increasingly realistic financial decisions. Your membership determines the levels available to you, while earlier levels remain available for review.");
  const realWorldFocus = translatedOr(t, "curriculum.realWorldFocus.title", "Real-World Focus");
  const realWorldFocusBody = translatedOr(t, "curriculum.realWorldFocus.body", "Learn concepts in context and practice applying them to decisions—not promises, predictions, or personalized investment advice.");

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <section className={`bg-gradient-to-r ${ACCENT[code] ?? ACCENT.BLACK} text-white`}>
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <Link href="/curriculum" className="text-sm text-white/70">{curriculum}</Link>
          <p className="mt-8 text-sm font-black tracking-[.3em] text-red-200">{code} {trackLabel.toUpperCase()}</p>
          <h1 className="mt-3 text-5xl font-black md:text-6xl">{track.name}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">{track.description}</p>
          <p className="mt-5 font-bold text-yellow-300">{translatedOr(t, "curriculum.lessonsCurrentlyAvailable", "{{count}} lessons currently available", { count: track.lessonCount })}</p>
        </div>
      </section>

      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-6 py-5 text-sm font-bold">
          <span className="text-blue-700">{overview}</span><span>{lessons}</span><span>{caseStudies}</span><span>{resources}</span><span>{flashcards}</span>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
          <div><h2 className="text-3xl font-black">{whatYouLearn}</h2><p className="mt-3 max-w-3xl leading-7 text-slate-600">{whatYouLearnBody}</p></div>
          <aside className="rounded-xl border border-blue-100 bg-blue-50 p-5"><p className="text-sm font-black uppercase tracking-[.2em] text-blue-700">{realWorldFocus}</p><p className="mt-3 leading-7 text-slate-700">{realWorldFocusBody}</p></aside>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((n) => {
            const found = track.levels.find((level) => level.level === n);
            const count = found?.lessonCount ?? 0;
            const levelName = translatedOr(t, LEVEL_NAME_KEYS[n - 1], ["Financial Literacy", "Financial Competency", "Applied Reasoning", "Strategic Integration", "Financial Intelligence"][n - 1]);
            return (
              <Link key={n} href={`/curriculum/${raw}/l${n}`} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <p className="text-xs font-black uppercase tracking-wider text-blue-700">{translatedOr(t, "curriculum.levelLabel", "Level {{level}}", { level: n })}</p>
                <h3 className="mt-2 text-lg font-black">{levelName}</h3>
                <p className="mt-3 text-sm text-slate-500">{count > 0 ? translatedOr(t, "curriculum.lessonsAvailable", "{{count}} lessons available", { count }) : translatedOr(t, "curriculum.inDevelopment", "Curriculum in development")}</p>
                {count > 0 && <p className="mt-4 text-sm font-bold text-blue-700">{n === 1 ? translatedOr(t, "curriculum.previewLessons", "Preview / open lessons →") : translatedOr(t, "curriculum.openLevel", "Open level →")}</p>}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
