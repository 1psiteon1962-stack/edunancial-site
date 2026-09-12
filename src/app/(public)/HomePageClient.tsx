"use client";

import Link from "next/link";
import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { getHomeMarketingCopy } from "@/lib/international/home-marketing-copy";
import { getHomeUiCopy } from "@/lib/international/home-ui-copy";

const featureIcons = ["◈", "▱", "◎", "▥"] as const;
const goals = ["business", "realEstate", "retirement", "finances", "career", "family"] as const;

export default function HomePageClient() {
  const { effectiveLanguage } = useInternationalPreferences();
  const copy = getHomeMarketingCopy(effectiveLanguage);
  const ui = getHomeUiCopy(effectiveLanguage);

  return <main className="bg-white text-[#071426]">
    <section className="relative isolate min-h-[360px] overflow-hidden bg-[#08213a] text-white sm:min-h-[390px] lg:min-h-[430px]">
      <img src="/home-human-goals.svg" alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-75" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071426] via-[#071426]/80 to-[#071426]/10" />
      <div className="relative mx-auto flex min-h-[360px] max-w-[1440px] items-center px-5 py-8 sm:min-h-[390px] sm:px-8 lg:min-h-[430px] lg:px-16">
        <div className="max-w-[590px]">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[.14em] text-sky-300">{copy.heroEyebrow}</p>
          <h1 className="text-[36px] font-black leading-[.98] tracking-[-.035em] sm:text-[44px] lg:text-[50px]">{copy.heroTitle}</h1>
          <p className="mt-3 max-w-[530px] text-[15px] leading-6 sm:text-base">{copy.heroBody}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/assessment" className="rounded-md bg-yellow-300 px-5 py-3 text-center text-[13px] font-black text-slate-950">{copy.takeAssessment}</Link>
            <Link href="/curriculum" className="rounded-md border border-white/80 bg-[#071426]/45 px-5 py-3 text-center text-[13px] font-bold">{copy.startFree}</Link>
          </div>
        </div>
      </div>
    </section>

    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-[1440px] grid-cols-4 divide-x divide-slate-200 px-2 sm:px-4">
        {ui.features.map(([title, body], index) => <div key={title} className="flex min-h-[70px] flex-col items-center justify-center gap-1 px-1 py-2 text-center sm:flex-row sm:gap-3 sm:px-4 sm:text-left"><span aria-hidden className="text-xl text-sky-500 sm:text-2xl">{featureIcons[index]}</span><div><h2 className="text-[10px] font-black leading-3 sm:text-[14px] sm:leading-4">{title}</h2><p className="hidden text-[12px] text-slate-600 sm:block">{body}</p></div></div>)}
      </div>
    </section>

    <section className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-16">
      <div className="max-w-[860px]"><p className="text-[10px] font-black tracking-[.14em] text-sky-700">{copy.whyLabel}</p><h2 className="mt-1 text-[23px] font-black leading-tight sm:text-[28px]">{copy.whyTitle}</h2><p className="mt-2 text-[13px] leading-5 text-slate-600">{copy.whyBody}</p></div>
      <div className="mt-4 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200 py-3">{copy.barriers.map(([title, body]) => <div key={title} className="px-2 sm:px-5"><h3 className="text-[12px] font-black leading-4 sm:text-[15px]">{title}</h3><p className="mt-1 hidden text-[12px] leading-4 text-slate-600 sm:block">{body}</p></div>)}</div>
    </section>

    <section className="bg-[#071426] text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-16">
        <div className="flex items-end justify-between gap-3"><div><p className="text-[10px] font-black tracking-[.14em] text-sky-300">{copy.colorLabel}</p><h2 className="mt-1 text-[23px] font-black leading-tight">{copy.colorTitle}</h2></div><Link href="/curriculum" className="hidden text-[13px] font-semibold text-sky-300 md:block">{copy.explorePathway}</Link></div>
        <div className="mt-4 grid grid-cols-4 gap-2 lg:grid-cols-8">{copy.tracks.map((track) => <Link href={track.href} key={track.code} className={`flex min-h-[104px] flex-col justify-between rounded-md border p-2 transition hover:-translate-y-0.5 ${track.className}`}><p className="text-[9px] font-black tracking-[.12em]">{track.code}</p><h3 className="text-[11px] font-black leading-3 sm:text-[13px] sm:leading-4">{track.title}</h3></Link>)}</div>
      </div>
    </section>

    <section className="bg-gradient-to-b from-sky-50 to-white">
      <div className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-16">
        <div className="text-center"><h2 className="text-[25px] font-black">{ui.goalsTitle}</h2><p className="mt-1 text-[13px] text-slate-600">{ui.goalsBody}</p></div>
        <div className="mt-3 grid grid-cols-3 gap-2 lg:grid-cols-6">{goals.map((goal) => { const [title, body] = ui.goals[goal]; return <Link href={`/assessment?goal=${goal}`} key={goal} className="min-h-[82px] rounded-md border border-slate-200 bg-white p-3 shadow-sm"><div className="flex justify-between gap-1"><h3 className="text-[11px] font-black leading-4 sm:text-[13px]">{title}</h3><span aria-hidden>→</span></div><p className="mt-1 hidden text-[11px] leading-[14px] text-slate-600 sm:block">{body}</p></Link>; })}</div>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-md bg-sky-100 px-4 py-3 sm:px-8"><div><h3 className="text-[14px] font-black">{copy.assessmentLabel}</h3><p className="hidden text-[12px] text-slate-600 sm:block">{copy.assessmentBody}</p></div><Link href="/assessment" className="shrink-0 rounded-md bg-blue-600 px-5 py-3 text-[12px] font-bold text-white">{copy.assessmentCta}</Link></div>
      </div>
    </section>
  </main>;
}
