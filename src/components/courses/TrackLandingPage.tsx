"use client";

import Link from "next/link";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

type TrackKey = "red" | "white" | "blue";

type LocaleContent = {
  eyebrow: string;
  title: string;
  overview: string;
  courseNote?: string;
  courses: string[];
  books: string[];
  path: string[];
  comingSoon: string[];
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
};

function SectionList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-2xl font-black">{title}</h2>
      <ul className="mt-4 space-y-3 text-slate-300">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </section>
  );
}

function TrackLayout({
  content,
  coursesLabel,
  booksLabel,
  pathLabel,
  comingSoonLabel,
  noteTitle,
}: {
  content: LocaleContent;
  coursesLabel: string;
  booksLabel: string;
  pathLabel: string;
  comingSoonLabel: string;
  noteTitle?: string;
}) {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">{content.eyebrow}</p>
        <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight md:text-6xl">{content.title}</h1>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">{content.overview}</p>
        {content.courseNote && noteTitle && (
          <div className="mt-8 rounded-2xl border border-blue-400/30 bg-blue-500/10 p-6 text-slate-200">
            <p className="font-semibold text-blue-200">{noteTitle}</p>
            <p className="mt-3 leading-7">{content.courseNote}</p>
          </div>
        )}
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href={content.primaryCta.href} className="rounded-xl bg-blue-600 px-6 py-4 font-bold hover:bg-blue-700">
            {content.primaryCta.label}
          </Link>
          <Link href={content.secondaryCta.href} className="rounded-xl border border-white/20 px-6 py-4 font-bold hover:bg-white hover:text-slate-950">
            {content.secondaryCta.label}
          </Link>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <SectionList title={coursesLabel} items={content.courses} />
          <SectionList title={booksLabel} items={content.books} />
          <SectionList title={pathLabel} items={content.path} />
          <SectionList title={comingSoonLabel} items={content.comingSoon} />
        </div>
      </section>
    </main>
  );
}

function getTrackContent(
  track: TrackKey,
  language: string,
  t: (key: string) => string,
): LocaleContent {
  const secondaryHref = language === "es" ? "/courses" : "/membership";

  return {
    eyebrow: t(`track.${track}.eyebrow`),
    title: t(`track.${track}.title`),
    overview: t(`track.${track}.overview`),
    courseNote: t(`track.${track}.courseNote`),
    courses: [1, 2, 3].map((index) => t(`track.${track}.courses.${index}`)),
    books: [1, 2, 3].map((index) => t(`track.${track}.books.${index}`)),
    path: [1, 2, 3].map((index) => t(`track.${track}.path.${index}`)),
    comingSoon: [1, 2].map((index) => t(`track.${track}.comingSoon.${index}`)),
    primaryCta: {
      href: track === "red" ? "/courses/red-real-estate" : track === "white" ? "/courses/white-paper-assets" : "/courses/blue-business",
      label: t(`track.${track}.primaryCta`),
    },
    secondaryCta: {
      href: secondaryHref,
      label: t(`track.${track}.secondaryCta`),
    },
  };
}

export default function TrackLandingPage({ track }: { track: TrackKey }) {
  const { effectiveLanguage, t } = useInternationalPreferences();
  const content = getTrackContent(track, effectiveLanguage, t);
  const noteTitle = t("track.noteTitle");

  return (
    <TrackLayout
      content={content}
      coursesLabel={t("track.coursesLabel")}
      booksLabel={t("track.booksLabel")}
      pathLabel={t("track.pathLabel")}
      comingSoonLabel={t("track.comingSoonLabel")}
      noteTitle={content.courseNote ? noteTitle : undefined}
    />
  );
}
