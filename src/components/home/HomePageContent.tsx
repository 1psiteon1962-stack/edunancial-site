"use client";

import Link from "next/link";

import MemberSuccessStories from "@/components/home/MemberSuccessStories";
import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

function HomeLayout() {
  const { t } = useInternationalPreferences();

  const ctas = [
    {
      href: "/register",
      label: t("home.hero.cta.member"),
      className:
        "inline-flex items-center justify-center rounded-xl bg-yellow-400 px-6 py-4 text-base font-black text-black transition hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
    },
    {
      href: "/pricing",
      label: t("home.hero.cta.pricing"),
      className:
        "inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
    },
    {
      href: "/login",
      label: t("home.hero.cta.login"),
      className:
        "inline-flex items-center justify-center rounded-xl border border-white/60 px-6 py-4 text-base font-bold transition hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
    },
  ];

  const dashboardCards = [
    [t("home.dashboard.cards.1.title"), t("home.dashboard.cards.1.body"), "/courses/white"],
    [t("home.dashboard.cards.2.title"), t("home.dashboard.cards.2.body"), "/courses/red"],
    [t("home.dashboard.cards.3.title"), t("home.dashboard.cards.3.body"), "/courses/blue"],
    [t("home.dashboard.cards.4.title"), t("home.dashboard.cards.4.body"), "/ai-coach"],
    [t("home.dashboard.cards.5.title"), t("home.dashboard.cards.5.body"), "/courses"],
    [t("home.dashboard.cards.6.title"), t("home.dashboard.cards.6.body"), "/books"],
    [t("home.dashboard.cards.7.title"), t("home.dashboard.cards.7.body"), "/community"],
    [t("home.dashboard.cards.8.title"), t("home.dashboard.cards.8.body"), "/downloads"],
    [t("home.dashboard.cards.9.title"), t("home.dashboard.cards.9.body"), "/dashboard"],
  ] as const;

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section aria-labelledby="homepage-story-heading" className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-10 rounded-3xl border border-white/10 bg-slate-950/50 p-8 md:p-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">{t("home.story.label")}</p>
            <h2 id="homepage-story-heading" className="mt-6 text-3xl font-black sm:text-4xl md:text-5xl">
              {t("home.story.heading")}
            </h2>
            <div className="mt-6 max-w-3xl space-y-4 text-lg leading-8 text-slate-300">
              {[1, 2, 3, 4].map((index) => (
                <p key={index}>{t(`home.story.paragraphs.${index}`)}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/our-story"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700"
              >
                {t("home.story.link.ourStory")}
              </Link>
              <Link
                href="/mission"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-4 font-bold text-white transition hover:bg-white hover:text-slate-950"
              >
                {t("home.story.link.missionVision")}
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {[1, 2, 3].map((index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-xl font-bold">{t(`home.story.cards.${index}.title`)}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {t(`home.story.cards.${index}.body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="homepage-hero-heading" className="border-b border-white/10 bg-gradient-to-b from-[#08101f] via-[#0d1730] to-[#08101f]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.45em] text-yellow-300 md:text-sm">Edunancial</p>
            <h1 id="homepage-hero-heading" className="mt-6 text-4xl font-black leading-tight sm:text-5xl md:text-7xl">
              {t("home.hero.title")}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8 md:text-xl">
              {t("branding.longDescription")}
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
              {t("home.hero.methods")}
            </p>
            <div className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {ctas.map((cta) => (
                <Link key={cta.label} href={cta.href} className={cta.className}>
                  {cta.label}
                </Link>
              ))}
            </div>
            <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              {[1, 2, 3].map((index) => (
                <span key={index} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  {t(`home.hero.badges.${index}`)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MemberSuccessStories stories={[]} />

      <section aria-labelledby="homepage-dashboard-heading" className="mx-auto max-w-7xl px-6 pb-16 md:pb-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">{t("home.dashboard.label")}</p>
            <h2 id="homepage-dashboard-heading" className="mt-4 text-3xl font-black sm:text-4xl md:text-5xl">
              {t("home.dashboard.heading")}
            </h2>
          </div>
          <Link href="/dashboard" className="font-bold text-blue-300 hover:text-blue-200">
            {t("home.dashboard.link")}
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardCards.map(([title, description, href]) => (
            <Link key={title} href={href} className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 transition hover:border-blue-400 hover:bg-slate-900">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-black sm:text-2xl">{title}</h3>
                <span aria-hidden="true" className="text-blue-300">&rarr;</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-label={t("home.trial.label")} className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-slate-400">{t("home.trial.label")}</p>
            <p className="mt-2 text-sm text-slate-300">{t("home.trial.body")}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="homepage-final-cta-heading" className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="rounded-3xl border border-blue-500/30 bg-blue-500/10 p-8 md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.4em] text-blue-300">{t("home.final.label")}</p>
              <h2 id="homepage-final-cta-heading" className="mt-4 text-3xl font-black sm:text-4xl md:text-5xl">
                {t("home.final.heading")}
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">{t("home.final.body")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/register" className="inline-flex items-center justify-center rounded-2xl bg-yellow-400 px-6 py-5 text-center font-black text-slate-950 transition hover:bg-yellow-300">
                {t("home.final.primary")}
              </Link>
              <Link href="/ai-coach" className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-6 py-5 text-center font-bold text-white transition hover:bg-white/20">
                {t("home.final.secondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function HomePageContent() {
  return <HomeLayout />;
}
