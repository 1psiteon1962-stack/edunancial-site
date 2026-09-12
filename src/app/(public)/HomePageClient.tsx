"use client";

import Link from "next/link";
import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { getHomeMarketingCopy } from "@/lib/international/home-marketing-copy";

export default function HomePageClient() {
  const { effectiveLanguage } = useInternationalPreferences();
  const copy = getHomeMarketingCopy(effectiveLanguage);

  return <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <p className="text-sm font-black uppercase tracking-[.25em] text-blue-600">{copy.whyLabel}</p>
          <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">{copy.whyTitle}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{copy.whyBody}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/assessment" className="rounded-lg bg-blue-600 px-7 py-4 text-center font-bold text-white">{copy.takeAssessment}</Link>
            <Link href="/curriculum" className="rounded-lg border border-slate-300 bg-white px-7 py-4 text-center font-bold">{copy.startFree}</Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">{copy.freeAccessNote}</p>
        </div>
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100 via-white to-yellow-100 shadow-sm">
          <img src="/home-human-goals.svg" alt="" className="h-auto w-full" />
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center">
        <p className="text-sm font-black uppercase tracking-[.25em] text-blue-600">{copy.assessmentLabel}</p>
        <h2 className="mt-3 text-4xl font-black">{copy.assessmentTitle}</h2>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600">{copy.assessmentBody}</p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {copy.barriers.map(([problem, solution]) => <div key={problem} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-xl font-black text-slate-950">“{problem}”</p>
          <p className="mt-4 leading-7 text-slate-600">{solution}</p>
        </div>)}
      </div>
      <div className="mt-8 text-center"><Link href="/assessment" className="inline-block rounded-lg bg-blue-600 px-8 py-4 font-bold text-white">{copy.assessmentCta}</Link></div>
    </section>

    <section className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center"><p className="text-sm font-black uppercase tracking-[.25em] text-yellow-300">{copy.colorLabel}</p><h2 className="mt-3 text-4xl font-black">{copy.colorTitle}</h2><p className="mx-auto mt-4 max-w-3xl text-slate-300">{copy.colorBody}</p></div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{copy.tracks.map((track) => <Link href={track.href} key={track.code} className={`rounded-2xl border p-6 ${track.className}`}><p className="text-xs font-black tracking-[.3em] text-slate-400">{track.code}</p><h3 className="mt-3 text-2xl font-black">{track.title}</h3><p className="mt-3 leading-7 text-slate-300">{track.body}</p><p className="mt-5 font-bold text-yellow-300">{copy.explorePathway}</p></Link>)}</div>
      </div>
    </section>

    <section className="bg-white"><div className="mx-auto max-w-5xl px-6 py-16 text-center"><p className="text-sm font-black uppercase tracking-[.25em] text-blue-600">{copy.journeyLabel}</p><h2 className="mt-3 text-4xl font-black">{copy.journeyTitle}</h2><p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">{copy.journeyBody}</p><div className="mt-8 flex flex-wrap justify-center gap-3">{copy.journeySteps.map((step, index) => <span key={step} className="rounded-full bg-slate-100 px-5 py-3 font-bold">{index + 1}. {step}</span>)}</div></div></section>

    <section className="mx-auto max-w-7xl px-6 py-16"><div className="grid gap-8 lg:grid-cols-2"><div className="rounded-3xl bg-blue-50 p-8"><p className="text-sm font-black uppercase tracking-[.25em] text-blue-600">{copy.trustLabel}</p><h2 className="mt-3 text-3xl font-black">{copy.trustTitle}</h2><p className="mt-5 leading-8 text-slate-600">{copy.trustBody}</p></div><div className="rounded-3xl bg-amber-50 p-8"><h2 className="text-2xl font-black">{copy.noticeTitle}</h2><p className="mt-5 leading-8 text-slate-600">{copy.noticeBody}</p></div></div></section>

    <section className="bg-slate-950 text-white"><div className="mx-auto max-w-5xl px-6 py-16 text-center"><p className="text-sm font-black uppercase tracking-[.25em] text-yellow-300">{copy.finalLabel}</p><h2 className="mt-3 text-4xl font-black">{copy.finalTitle}</h2><p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">{copy.finalBody}</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/curriculum" className="rounded-lg bg-yellow-300 px-8 py-4 font-bold text-slate-950">{copy.startFree}</Link><Link href="/assessment" className="rounded-lg border border-white/30 px-8 py-4 font-bold">{copy.assessmentCta}</Link></div></div></section>
  </main>;
}
