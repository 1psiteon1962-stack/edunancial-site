"use client";

import Link from "next/link";
import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { getHomeMarketingCopy } from "@/lib/international/home-marketing-copy";

const features = [
  ["realWorld", "◈"], ["pace", "▱"], ["global", "◎"], ["pathway", "▥"],
] as const;

const goals = ["business", "realEstate", "retirement", "finances", "career", "family"] as const;

export default function HomePageClient() {
  const { effectiveLanguage, t } = useInternationalPreferences();
  const copy = getHomeMarketingCopy(effectiveLanguage);

  return <main className="bg-white text-[#071426]">
    <section className="relative isolate h-[355px] overflow-hidden bg-[#08213a] text-white sm:h-[390px] lg:h-[430px]">
      <img src="/home-human-goals.svg" alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071426] via-[#071426]/80 to-[#071426]/10" />
      <div className="relative mx-auto flex h-full max-w-[1440px] items-center px-5 sm:px-8 lg:px-16">
        <div className="max-w-[560px]">
          <h1 className="text-[36px] font-black leading-[.98] tracking-[-.035em] sm:text-[44px] lg:text-[48px]">{copy.heroTitle}</h1>
          <p className="mt-3 max-w-[500px] text-[15px] leading-6 sm:text-base">{copy.heroBody}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/curriculum" className="min-w-40 rounded-md bg-yellow-300 px-6 py-3 text-center font-black text-slate-950">{copy.startFree}</Link>
            <Link href="/assessment" className="min-w-52 rounded-md border border-white bg-[#071426]/40 px-6 py-3 text-center font-semibold">{copy.takeAssessment}</Link>
          </div>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[.08em]">{copy.heroEyebrow}</p>
        </div>
        <div className="absolute right-8 top-1/2 hidden max-w-[210px] -translate-y-1/2 text-xl font-bold leading-6 lg:block">{copy.finalLabel}<div className="mt-3 h-1 w-12 bg-sky-400" /></div>
      </div>
    </section>

    <section className="border-b border-slate-200">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-slate-200 px-4 lg:grid-cols-4">
        {features.map(([key, icon]) => <div key={key} className="flex min-h-[78px] items-center gap-4 px-5 py-3"><span aria-hidden className="text-3xl text-sky-500">{icon}</span><div><h2 className="text-[15px] font-black leading-5">{t(`home.feature.${key}.title`)}</h2><p className="text-[13px] text-slate-600">{t(`home.feature.${key}.body`)}</p></div></div>)}
      </div>
    </section>

    <section className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-16">
      <div className="flex items-end justify-between"><div><h2 className="text-[24px] font-black">{copy.colorTitle}</h2><p className="mt-1 text-[13px] text-slate-600">{copy.colorBody}</p></div><Link href="/curriculum" className="hidden text-[13px] font-semibold text-sky-600 md:block">{copy.explorePathway}</Link></div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">{copy.tracks.map((track) => <Link href={track.href} key={track.code} className={`flex h-[150px] flex-col justify-end rounded-md border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${track.className}`}><p className="mb-auto text-[10px] font-black tracking-[.15em]">{track.code}</p><h3 className="text-[15px] font-black leading-4">{track.title}</h3><p className="mt-1 text-[12px] leading-[15px]">{track.body}</p></Link>)}</div>
    </section>

    <section className="bg-gradient-to-b from-sky-50 to-white">
      <div className="mx-auto max-w-[1440px] px-5 py-3 sm:px-8 lg:px-16">
        <div className="text-center"><h2 className="text-[27px] font-black">{t("home.goals.title")}</h2><p className="text-[13px] text-slate-600">{t("home.goals.body")}</p></div>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-6">{goals.map((goal) => <Link href={`/assessment?goal=${goal}`} key={goal} className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm"><div className="p-3"><div className="flex justify-between gap-2"><h3 className="text-[13px] font-black leading-4">{t(`home.goal.${goal}.title`)}</h3><span aria-hidden>→</span></div><p className="mt-1 text-[11px] leading-[14px] text-slate-600">{t(`home.goal.${goal}.body`)}</p></div></Link>)}</div>
        <div className="mt-3 flex flex-col items-start justify-between gap-3 rounded-md bg-sky-100 px-8 py-3 sm:flex-row sm:items-center"><div><h3 className="text-[16px] font-black">{copy.assessmentLabel}</h3><p className="text-[12px] text-slate-600">{copy.assessmentBody}</p></div><Link href="/assessment" className="rounded-md bg-blue-600 px-8 py-3 text-[13px] font-bold text-white">{copy.assessmentCta}</Link></div>
      </div>
    </section>
  </main>;
}
