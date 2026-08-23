"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { competencyLevel, type CompetencyScores } from "@/lib/assessment/scoring";

const RESULTS_KEY = "edu_assessment_results";

interface StoredResults {
  scores: CompetencyScores;
  level: string;
  completedAt: string;
}

const AREA_LABELS: Record<string, string> = {
  personalFinance: "Personal Finance",
  investing: "Investing & Paper Assets",
  realEstate: "Real Estate",
  business: "Business Ownership",
  riskManagement: "Risk Management",
  financialProfile: "Financial Decision-Making",
};

const AREA_COLORS: Record<string, { bg: string; text: string }> = {
  personalFinance: { bg: "bg-green-700", text: "text-white" },
  investing: { bg: "bg-white", text: "text-slate-900" },
  realEstate: { bg: "bg-red-700", text: "text-white" },
  business: { bg: "bg-blue-700", text: "text-white" },
  riskManagement: { bg: "bg-yellow-600", text: "text-white" },
  financialProfile: { bg: "bg-purple-700", text: "text-white" },
};

const RECOMMENDATIONS: Record<string, { title: string; desc: string; href: string }[]> = {
  personalFinance: [
    { title: "Build Your Financial Defense", desc: "Strengthen cash flow, reserves, credit, and debt decisions before deploying more capital.", href: "/curriculum" },
    { title: "Then Build Financial Offense", desc: "Use that stronger foundation to begin evaluating ownership and investment opportunities.", href: "/curriculum/WHITE/l1" },
  ],
  investing: [
    { title: "WHITE — Paper Assets", desc: "Learn how stocks, bonds, ETFs, diversification, risk, and financial markets work.", href: "/curriculum/WHITE/l1" },
    { title: "GOLD — Investing", desc: "Develop the ability to decide where capital should go and why.", href: "/curriculum/GOLD/l1" },
  ],
  realEstate: [
    { title: "RED — Real Estate", desc: "Learn property, financing, cash flow, leverage, risk, and the mechanics of real-estate ownership.", href: "/curriculum/RED/l1" },
    { title: "Build Toward Deal Analysis", desc: "Progress from understanding property to evaluating whether an acquisition actually builds wealth.", href: "/curriculum/RED/l1" },
  ],
  business: [
    { title: "BLUE — Business", desc: "Learn revenue, profit, margins, business ownership, financing, and entrepreneurship fundamentals.", href: "/curriculum/BLUE/l1" },
    { title: "Build Toward Ownership", desc: "Use the curriculum to move from understanding a business to operating and evaluating one.", href: "/curriculum/BLUE/l1" },
  ],
  riskManagement: [
    { title: "Strengthen Financial Defense", desc: "Improve reserves, downside planning, insurance awareness, and risk recognition.", href: "/curriculum/PURPLE/l1" },
    { title: "Learn Before You Leverage", desc: "Understand downside exposure before using debt or capital to pursue higher returns.", href: "/curriculum/RED/l1" },
  ],
  financialProfile: [
    { title: "Develop Financial Intelligence", desc: "Practice comparing alternatives by cash flow, risk, liquidity, taxes, leverage, and opportunity cost.", href: "/curriculum" },
    { title: "Start With the Edunancial Foundations", desc: "Learn each financial chess piece before combining them into more advanced strategies.", href: "/curriculum" },
  ],
};

type AreaKey = "personalFinance" | "investing" | "realEstate" | "business" | "riskManagement" | "financialProfile";
const ALL_AREAS: AreaKey[] = ["personalFinance", "investing", "realEstate", "business", "riskManagement", "financialProfile"];

function getWeakestArea(scores: CompetencyScores): AreaKey {
  return [...ALL_AREAS].sort((a, b) => scores[a] - scores[b])[0];
}

function getStrongestAreas(scores: CompetencyScores): AreaKey[] {
  return [...ALL_AREAS].sort((a, b) => scores[b] - scores[a]).slice(0, 2);
}

export default function AssessmentResultsClient() {
  const [results, setResults] = useState<StoredResults | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RESULTS_KEY);
      if (raw) setResults(JSON.parse(raw));
    } catch {
      // Keep the public sample available even if local storage is unavailable.
    }
    setLoaded(true);
  }, []);

  const demoScores: CompetencyScores = {
    overall: 82,
    personalFinance: 91,
    investing: 84,
    realEstate: 76,
    business: 95,
    riskManagement: 79,
    financialProfile: 85,
  };

  const scores = results?.scores ?? demoScores;
  const level = results?.level ?? competencyLevel(82);
  const weakest = getWeakestArea(scores);
  const strongest = getStrongestAreas(scores);
  const opportunities = [...ALL_AREAS].sort((a, b) => scores[a] - scores[b]).slice(0, 3);
  const primaryRecommendationHref = RECOMMENDATIONS[weakest]?.[0]?.href ?? "/curriculum";

  if (!loaded) {
    return <main className="flex min-h-screen items-center justify-center"><p className="text-slate-400">Loading results…</p></main>;
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="font-bold uppercase tracking-[0.45em] text-green-400">Your Starting Point</p>
        <h1 className="mt-6 text-6xl font-black">Your Financial<br />Intelligence Profile</h1>
        <p className="mt-5 max-w-4xl text-xl text-slate-300">
          This is not a pass/fail grade. It is a baseline showing what you already understand and where focused learning may create the greatest opportunity for growth.
        </p>
        {!results && (
          <p className="mt-3 text-sm text-slate-500">Showing sample results. Complete the <Link href="/assessment/start" className="text-blue-400 underline">free diagnostic</Link> to see your personalized profile.</p>
        )}

        <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-700 via-green-600 to-blue-700 p-12 text-center">
          <p className="text-lg font-bold uppercase tracking-[0.4em]">Financial Intelligence Starting Score</p>
          <h2 className="mt-6 text-9xl font-black">{scores.overall}</h2>
          <p className="mt-6 text-3xl font-bold">Current benchmark: {level}</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_AREAS.map((area) => {
            const { bg, text } = AREA_COLORS[area];
            return <div key={area} className={`${bg} ${text} rounded-2xl p-8`}><p className="text-sm font-bold uppercase tracking-wider opacity-80">{AREA_LABELS[area]}</p><p className="mt-4 text-6xl font-black">{scores[area]}%</p><p className="mt-2 text-sm opacity-80">{competencyLevel(scores[area])}</p></div>;
          })}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-slate-900 p-8">
            <h2 className="text-3xl font-black">Your Greatest Strengths</h2>
            <p className="mt-3 text-slate-400">These areas can become pieces you use as you learn to make broader financial decisions.</p>
            <ul className="mt-6 space-y-4 text-slate-300">
              {strongest.map((area) => <li key={area} className="flex items-start gap-3"><span className="text-green-400">✓</span><span><strong>{AREA_LABELS[area]}</strong> — {scores[area]}%</span></li>)}
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-900 p-8">
            <h2 className="text-3xl font-black">Your Greatest Opportunities</h2>
            <p className="mt-3 text-slate-400">These are not failures. They are the areas where targeted learning can expand your financial options.</p>
            <div className="mt-5 space-y-3">
              {opportunities.map((area) => <div key={area} className="flex items-center justify-between rounded-lg bg-slate-800 px-4 py-3"><span>{AREA_LABELS[area]}</span><span className="font-bold text-yellow-400">{scores[area]}%</span></div>)}
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-blue-600/40 bg-[#111827] p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-400">Recommended First Move</p>
          <h2 className="mt-3 text-3xl font-black">Start With {AREA_LABELS[weakest]}</h2>
          <p className="mt-3 text-slate-400">Based on this diagnostic, this is your strongest opportunity for focused improvement. Edunancial can then help you connect that knowledge with the other financial pieces as you advance.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {RECOMMENDATIONS[weakest]?.map((rec, i) => (
              <div key={rec.title} className="rounded-xl bg-slate-800 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-yellow-400">Priority {i + 1}</p>
                <h3 className="mt-2 text-xl font-bold">{rec.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{rec.desc}</p>
                <Link href={rec.href} className="mt-5 inline-block font-bold text-blue-400 hover:text-blue-300">Start this path →</Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-r from-green-700 to-blue-700 p-10 text-center">
          <h2 className="text-4xl font-black">Learn the Pieces. Then Learn to Use Them Together.</h2>
          <p className="mx-auto mt-5 max-w-4xl text-xl text-white/90">Edunancial begins with financial literacy, then develops the ability to apply, analyze, and ultimately coordinate business, real estate, investing, taxes, law, sales, and leadership in wealth-building decisions.</p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-5">
          <Link href={primaryRecommendationHref} className="rounded-xl bg-blue-600 px-10 py-4 text-lg font-bold hover:bg-blue-700">Start My Recommended Learning</Link>
          <Link href="/dashboard" className="rounded-xl border border-white px-10 py-4 text-lg font-bold hover:bg-white hover:text-black">Save Progress in Dashboard</Link>
          <Link href="/membership" className="rounded-xl border border-yellow-500 px-10 py-4 text-lg font-bold text-yellow-400 hover:bg-yellow-600 hover:text-white">See Membership Options</Link>
        </div>
      </section>
    </main>
  );
}
