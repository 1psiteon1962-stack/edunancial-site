"use client";

import Link from "next/link";
import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { getHomeMarketingCopy } from "@/lib/international/home-marketing-copy";
import { getRecentPositioningCopy } from "@/lib/international/recent-positioning-copy";

export default function HomePageClient() {
  const { effectiveLanguage, t } = useInternationalPreferences();
  const copy = getHomeMarketingCopy(effectiveLanguage);
  const positioning = getRecentPositioningCopy(effectiveLanguage);
  const { label: pathwayLabel, title: pathwayTitle, steps: journeySteps } = positioning.pathway;

  return <main className="min-h-screen bg-[#08101f] text-white">
    <section className="border-b border-white/10 bg-gradient-to-b from-[#08101f] via-[#0d1730] to-[#08101f]"><div className="mx-auto max-w-7xl px-6 py-20 md:py-28"><div className="max-w-5xl">
      <p className="text-xs font-black uppercase tracking-[0.4em] text-yellow-300">{copy.heroEyebrow}</p><h1 className="mt-6 text-5xl font-black leading-tight sm:text-6xl md:text-7xl">{copy.heroTitle}</h1><p className="mt-7 max-w-4xl text-xl leading-9 text-slate-200">{copy.heroBody}</p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row"><Link href="/assessment" className="rounded-xl bg-yellow-400 px-8 py-4 text-center text-lg font-black text-black">{copy.takeAssessment}</Link><Link href="/curriculum" className="rounded-xl border border-white/40 px-8 py-4 text-center text-lg font-bold">{copy.startFree}</Link></div>
    </div></div></section>

    <section className="mx-auto max-w-7xl px-6 py-16 md:py-20"><div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">YOUR GOALS COME FIRST</p><h2 className="mt-4 text-4xl font-black md:text-5xl">What are you trying to accomplish?</h2><p className="mx-auto mt-5 max-w-3xl text-lg text-slate-300">Choose the need closest to your life. Edunancial helps connect the financial knowledge behind it.</p></div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{copy.barriers.map(([title, body], i) => <Link key={title} href="/assessment" className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:border-blue-400/50"><p className="text-xs font-black text-blue-300">0{i+1}</p><h3 className="mt-3 text-2xl font-black">{title}</h3><p className="mt-4 leading-7 text-slate-300">{body}</p><p className="mt-5 font-bold text-yellow-300">Find my starting point →</p></Link>)}</div>
    </section>

    <section className="border-y border-white/10 bg-slate-950/60"><div className="mx-auto max-w-7xl px-6 py-16 md:py-20"><p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">{pathwayLabel}</p><h2 className="mt-4 text-4xl font-black md:text-5xl">{pathwayTitle}</h2><p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">{copy.colorBody}</p><div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{copy.tracks.map(track => <Link key={track.code} href={track.href} className={`rounded-2xl border p-6 transition hover:-translate-y-1 ${track.className}`}><p className="text-xs font-black tracking-[0.35em] text-slate-300">{track.code}</p><h3 className="mt-3 text-2xl font-black">{track.title}</h3><p className="mt-3 text-sm leading-7 text-slate-300">{track.body}</p><p className="mt-5 text-sm font-bold text-yellow-300">{copy.explorePathway}</p></Link>)}</div></div></section>

    <section className="mx-auto max-w-7xl px-6 py-16"><div className="rounded-3xl border border-blue-400/20 bg-blue-500/10 p-8 md:p-10"><p className="text-sm font-bold uppercase tracking-[0.4em] text-blue-300">{copy.journeyLabel}</p><h2 className="mt-4 text-4xl font-black">{copy.journeyTitle}</h2><p className="mt-6 max-w-4xl text-lg leading-8 text-slate-200">{copy.journeyBody}</p><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{journeySteps.map((step,index)=><div key={step} className="rounded-xl border border-white/10 bg-slate-950/40 p-5"><p className="text-xs font-black text-blue-300">{copy.levelLabel} {index+1}+</p><p className="mt-2 font-black">{step}</p></div>)}</div></div></section>

    <section className="mx-auto max-w-7xl px-6 pb-20"><div className="rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-8 text-center md:p-12"><p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-300">{copy.finalLabel}</p><h2 className="mt-4 text-4xl font-black md:text-5xl">{copy.finalTitle}</h2><p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-200">{copy.finalBody}</p><div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row"><Link href="/assessment" className="rounded-xl bg-yellow-400 px-8 py-4 font-black text-black">{copy.assessmentCta}</Link><Link href="/curriculum" className="rounded-xl border border-white/40 px-8 py-4 font-bold">{copy.startFree}</Link></div><p className="mx-auto mt-6 max-w-3xl text-sm text-slate-400">{t("branding.methodsClarification")}</p></div></section>
  </main>;
}
