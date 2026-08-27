"use client";

import Link from "next/link";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

const tracks = [
  ["RED", "Real Estate", "Learn how property works as an investment, a business, and a wealth-building asset.", "/curriculum/red", "border-red-500/40 bg-red-500/10"],
  ["WHITE", "Paper Assets", "Understand stocks, bonds, funds, retirement accounts, and financial markets.", "/curriculum/white", "border-white/30 bg-white/5"],
  ["BLUE", "Business", "Move beyond earning income and learn how ownership and entrepreneurship work.", "/curriculum/blue", "border-blue-500/40 bg-blue-500/10"],
  ["GREEN", "Taxes", "Understand how taxes affect workers, investors, entrepreneurs, and business owners differently.", "/curriculum/green", "border-green-500/40 bg-green-500/10"],
  ["GOLD", "Investing", "Develop the judgment to evaluate opportunity, risk, return, and long-term strategy.", "/curriculum/gold", "border-yellow-500/40 bg-yellow-500/10"],
  ["PURPLE", "Law", "Understand contracts, entities, liability, rights, and the legal decisions surrounding ownership.", "/curriculum/purple", "border-purple-500/40 bg-purple-500/10"],
  ["ORANGE", "Sales & Marketing", "Learn how businesses attract customers, communicate value, and generate revenue.", "/curriculum/orange", "border-orange-500/40 bg-orange-500/10"],
  ["BLACK", "Leadership & Executive Management", "Develop the skills needed to lead people, organizations, and growth.", "/curriculum/black", "border-slate-500/40 bg-slate-500/10"],
] as const;

const barriers = [
  ["I don't know how.", "Financial decisions can feel inaccessible when nobody has shown you how the pieces work."],
  ["No one taught me.", "Most people are taught how to earn money. Far fewer are taught how to invest it, protect it, build assets, or understand ownership."],
  ["The system feels stacked against me.", "Financial intelligence starts by understanding the rules, choices, risks, and opportunities well enough to make informed decisions."],
] as const;

export default function HomePageClient() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section aria-labelledby="homepage-hero-heading" className="border-b border-white/10 bg-gradient-to-b from-[#08101f] via-[#0d1730] to-[#08101f]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.45em] text-yellow-300 md:text-sm">FROM FINANCIAL LITERACY TO FINANCIAL INTELLIGENCE</p>
            <h1 id="homepage-hero-heading" className="mt-6 text-5xl font-black leading-tight sm:text-6xl md:text-7xl">Financial Literacy Is Only the Beginning.</h1>
            <p className="mx-auto mt-7 max-w-4xl text-xl leading-9 text-slate-200">Build the financial intelligence to make better decisions about money, investing, business, taxes, real estate, law, ownership, sales, and leadership.</p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/curriculum" className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-8 py-4 text-lg font-black text-black transition hover:bg-yellow-300">Start Free</Link>
              <Link href="/assessment" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-blue-700">Take the Financial Intelligence Assessment</Link>
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-slate-400">Explore the first three lessons of Level 1 in each curriculum color without a paid membership.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="problem-heading" className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">WHY EDUNANCIAL EXISTS</p>
          <h2 id="problem-heading" className="mt-4 text-4xl font-black md:text-5xl">Most people are taught how to earn money. Far fewer are taught how to understand it.</h2>
          <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-slate-300">Investing, taxes, business ownership, contracts, real estate, sales, leadership, risk, and building assets all affect financial outcomes. Edunancial brings those disciplines together so learning can progress toward informed action.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">{barriers.map(([title, body]) => <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-7"><h3 className="text-2xl font-black text-yellow-300">{title}</h3><p className="mt-4 leading-7 text-slate-300">{body}</p></div>)}</div>
      </section>

      <section aria-labelledby="pathways-heading" className="border-y border-white/10 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">THE EDUNANCIAL COLOR SYSTEM</p>
          <h2 id="pathways-heading" className="mt-4 text-4xl font-black md:text-5xl">Eight disciplines. One objective: financial intelligence.</h2>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">Financial decisions rarely exist in isolation. Learn individual disciplines first, then develop the ability to connect them when evaluating real decisions.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{tracks.map(([code, title, body, href, className]) => <Link key={code} href={href} className={`rounded-2xl border p-6 transition hover:-translate-y-1 ${className}`}><p className="text-xs font-black tracking-[0.35em] text-slate-300">{code}</p><h3 className="mt-3 text-2xl font-black">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-300">{body}</p><p className="mt-5 text-sm font-bold text-yellow-300">Explore pathway →</p></Link>)}</div>
        </div>
      </section>

      <section aria-labelledby="journey-heading" className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="rounded-3xl border border-blue-400/20 bg-blue-500/10 p-8 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-blue-300">A LEARNING JOURNEY, NOT A COURSE LIBRARY</p>
          <h2 id="journey-heading" className="mt-4 text-4xl font-black md:text-5xl">Learn → Understand → Apply → Measure → Improve</h2>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-200">Start with financial literacy. Build competency. Practice applied decision-making. Use tools and scenarios to test what you understand. As Edunancial expands, higher-level pathways are designed to connect education with mentorship, business readiness, and external capital opportunities.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{["Financial literacy", "Financial competency", "Applied decision-making", "Financial intelligence"].map((step, index) => <div key={step} className="rounded-xl border border-white/10 bg-slate-950/40 p-5"><p className="text-xs font-black text-blue-300">LEVEL {index + 1}+</p><p className="mt-2 font-black">{step}</p></div>)}</div>
        </div>
      </section>

      <section aria-labelledby="assessment-heading" className="mx-auto max-w-7xl px-6 pb-16 md:pb-20">
        <div className="grid gap-8 rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-8 md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div><p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-300">DON'T KNOW WHERE TO START?</p><h2 id="assessment-heading" className="mt-4 text-3xl font-black sm:text-4xl">Find the gaps in your financial knowledge.</h2><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">Take the Financial Intelligence Assessment to identify areas where your knowledge appears stronger or weaker and use the result to choose a starting point.</p></div>
          <Link href="/assessment" className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-7 py-4 text-center font-black text-black transition hover:bg-yellow-300">Take the Assessment</Link>
        </div>
      </section>

      <section aria-labelledby="trust-heading" className="border-y border-white/10 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div><p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">EDUCATION BEFORE PROMOTION</p><h2 id="trust-heading" className="mt-4 text-4xl font-black">Learn the idea. Test your understanding. Make your own informed decisions.</h2><p className="mt-6 text-lg leading-8 text-slate-300">Edunancial is designed to teach concepts, frameworks, and decision-making skills—not to sell you a particular investment. Our objective is to help members understand more of the financial world around them.</p><div className="mt-7 flex flex-wrap gap-4"><Link href="/our-story" className="font-bold text-blue-300 hover:text-blue-200">Read our story →</Link><Link href="/mission" className="font-bold text-blue-300 hover:text-blue-200">Mission & vision →</Link></div></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-7"><h3 className="text-2xl font-black">Important educational notice</h3><p className="mt-4 leading-7 text-slate-300">Edunancial provides educational information and learning tools. Content is not individualized investment, legal, tax, accounting, or other professional advice. Examples and projections are illustrative and do not guarantee results. When a decision requires professional advice, consult an appropriately qualified professional.</p><p className="mt-4 text-sm leading-7 text-slate-400">{t("branding.methodsClarification")}</p></div>
          </div>
        </div>
      </section>

      <section aria-labelledby="membership-heading" className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">CHOOSE HOW FAR YOU WANT TO GO</p><h2 id="membership-heading" className="mt-4 text-4xl font-black md:text-5xl">Membership is about progression—not simply more lessons.</h2></div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[["BASIC", "Build Your Foundation", "Levels 1–2", "Move from financial literacy toward financial competency."], ["PRO", "Learn to Apply It", "Levels 1–4", "Develop applied reasoning and begin using concepts in more realistic financial and business decisions."], ["GOLD", "Build Financial Intelligence", "Levels 1–5", "Advanced strategy, integration, and applied decision-making across Edunancial disciplines."]].map(([plan, title, levels, body]) => <div key={plan} className="rounded-2xl border border-white/10 bg-white/5 p-7"><p className="text-sm font-black tracking-[0.3em] text-yellow-300">{plan}</p><h3 className="mt-3 text-2xl font-black">{title}</h3><p className="mt-2 font-bold text-blue-300">{levels}</p><p className="mt-4 leading-7 text-slate-300">{body}</p></div>)}
        </div>
        <div className="mt-8 text-center"><Link href="/membership" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700">Compare Membership Options</Link></div>
      </section>

      <section aria-labelledby="final-heading" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-3xl border border-blue-500/30 bg-blue-500/10 p-8 text-center md:p-12"><p className="text-sm font-bold uppercase tracking-[0.4em] text-blue-300">START WITH WHAT YOU DON'T KNOW</p><h2 id="final-heading" className="mt-4 text-4xl font-black md:text-5xl">You don't need to master everything today. You need a place to begin.</h2><p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-200">Explore free lessons or take the assessment and begin building your financial intelligence one decision at a time.</p><div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row"><Link href="/curriculum" className="rounded-xl bg-yellow-400 px-8 py-4 font-black text-black hover:bg-yellow-300">Start Free</Link><Link href="/assessment" className="rounded-xl border border-white/40 px-8 py-4 font-bold hover:bg-white hover:text-slate-950">Take the Assessment</Link></div></div>
      </section>
    </main>
  );
}
