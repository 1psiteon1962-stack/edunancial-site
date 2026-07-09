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
  investing: "Investing",
  realEstate: "Real Estate",
  business: "Business",
  riskManagement: "Risk Management",
  financialProfile: "Financial Profile",
};

const AREA_COLORS: Record<string, { bg: string; text: string }> = {
  personalFinance: { bg: "bg-green-700", text: "text-white" },
  investing: { bg: "bg-white", text: "text-slate-900" },
  realEstate: { bg: "bg-red-700", text: "text-white" },
  business: { bg: "bg-blue-700", text: "text-white" },
  riskManagement: { bg: "bg-yellow-600", text: "text-white" },
  financialProfile: { bg: "bg-purple-700", text: "text-white" },
};

const RECOMMENDATIONS: Record<string, { title: string; desc: string }[]> = {
  personalFinance: [
    { title: "Personal Financial Management", desc: "Budgeting, cash flow, and financial decision-making fundamentals." },
    { title: "Credit Mastery & Debt Elimination", desc: "Repair and leverage your credit for financial advantage." },
  ],
  investing: [
    { title: "Stocks & ETF Investing", desc: "Build a portfolio with stocks, ETFs, and index funds." },
    { title: "Retirement Planning Mastery", desc: "IRA, 401(k), Roth strategies, and Social Security optimization." },
  ],
  realEstate: [
    { title: "Real Estate Fundamentals", desc: "Build a solid foundation in real estate investing." },
    { title: "Building Wealth Through Real Estate", desc: "Comprehensive real estate wealth-building from acquisition to cash flow." },
  ],
  business: [
    { title: "Startup Fundamentals", desc: "Business model, validation, and market fit." },
    { title: "Executive KPI Dashboard", desc: "Measure and optimize business performance." },
  ],
  riskManagement: [
    { title: "Advanced Risk Management", desc: "Asset protection, insurance, and wealth preservation." },
    { title: "Economic Self-Defense", desc: "Protect your wealth from inflation and downturns." },
  ],
  financialProfile: [
    { title: "Personal Financial Management", desc: "Build disciplined financial habits from the ground up." },
    { title: "Economic Self-Defense", desc: "Comprehensive financial foundation for lasting wealth." },
  ],
};

type AreaKey = "personalFinance" | "investing" | "realEstate" | "business" | "riskManagement" | "financialProfile";

const ALL_AREAS: AreaKey[] = ["personalFinance", "investing", "realEstate", "business", "riskManagement", "financialProfile"];

function getWeakestArea(scores: CompetencyScores): AreaKey {
  let weakest: AreaKey = ALL_AREAS[0];
  let min = scores[weakest];
  for (const area of ALL_AREAS) {
    if (scores[area] < min) {
      min = scores[area];
      weakest = area;
    }
  }
  return weakest;
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
      // ignore
    }
    setLoaded(true);
  }, []);

  // Fallback demo data when no assessment has been completed
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

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">Loading results…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="font-bold uppercase tracking-[0.45em] text-green-400">
          Assessment Results
        </p>
        <h1 className="mt-6 text-6xl font-black">
          Your Financial<br />Competency Report
        </h1>
        {!results && (
          <p className="mt-3 text-sm text-slate-500">
            Showing sample results. Complete the{" "}
            <Link href="/assessment/start" className="text-blue-400 underline">
              assessment
            </Link>{" "}
            to see your personalized report.
          </p>
        )}

        {/* Overall score */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-700 via-green-600 to-blue-700 p-12 text-center">
          <p className="text-lg font-bold uppercase tracking-[0.4em]">
            Overall Financial Competency Score
          </p>
          <h2 className="mt-6 text-9xl font-black">{scores.overall}</h2>
          <p className="mt-6 text-3xl font-bold">{level} Financial Competency</p>
        </div>

        {/* Category scores */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_AREAS.map((area) => {
            const { bg, text } = AREA_COLORS[area];
            return (
              <div key={area} className={`${bg} ${text} rounded-2xl p-8`}>
                <p className="text-sm font-bold uppercase tracking-wider opacity-80">
                  {AREA_LABELS[area]}
                </p>
                <p className="mt-4 text-6xl font-black">{scores[area]}%</p>
                <p className="mt-2 text-sm opacity-80">{competencyLevel(scores[area])}</p>
              </div>
            );
          })}
        </div>

        {/* Strengths & opportunities */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-slate-900 p-8">
            <h2 className="text-3xl font-black">Your Greatest Strengths</h2>
            <ul className="mt-6 space-y-4 text-slate-300">
              {strongest.map((area) => (
                <li key={area} className="flex items-start gap-3">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <div>
                    <span className="font-semibold">{AREA_LABELS[area]}</span>
                    <span className="ml-2 text-green-400 font-bold">{scores[area]}%</span>
                  </div>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Overall Financial Competency Level: <strong>{level}</strong></span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-slate-900 p-8">
            <h2 className="text-3xl font-black">Greatest Opportunities</h2>
            <p className="mt-4 text-slate-400 text-sm">
              Focus your learning here for the greatest improvement in your overall score.
            </p>
            <div className="mt-5 space-y-3">
              {[...ALL_AREAS]
                .sort((a, b) => scores[a] - scores[b])
                .slice(0, 3)
                .map((area) => (
                  <div key={area} className="flex items-center justify-between rounded-lg bg-slate-800 px-4 py-3">
                    <span>{AREA_LABELS[area]}</span>
                    <span className="font-bold text-yellow-400">{scores[area]}%</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Progress bars */}
        <div className="mt-12 rounded-2xl bg-slate-900 p-8">
          <h2 className="text-3xl font-black">Competency Breakdown</h2>
          <div className="mt-8 space-y-5">
            {ALL_AREAS.map((area) => (
              <div key={area}>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>{AREA_LABELS[area]}</span>
                  <span>{scores[area]}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-700">
                  <div
                    className="h-3 rounded-full bg-blue-500 transition-all"
                    style={{ width: `${scores[area]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Roadmap */}
        <div className="mt-12 rounded-2xl border border-blue-600/40 bg-[#111827] p-8">
          <h2 className="text-3xl font-black">Personalized Learning Roadmap</h2>
          <p className="mt-3 text-slate-400">
            Based on your assessment, we recommend focusing first on your{" "}
            <strong className="text-yellow-400">{AREA_LABELS[weakest]}</strong> competency
            while continuing to strengthen your strengths.
          </p>
          <div className="mt-8 space-y-4">
            {RECOMMENDATIONS[weakest]?.map((rec, i) => (
              <div key={rec.title} className="rounded-xl bg-slate-800 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2">
                  Priority {i + 1}
                </p>
                <h3 className="text-xl font-bold">{rec.title}</h3>
                <p className="mt-2 text-slate-400 text-sm">{rec.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-green-700 to-blue-700 p-10 text-center">
          <h2 className="text-4xl font-black">Keep Building Financial Competency</h2>
          <p className="mx-auto mt-5 max-w-3xl text-xl text-white/90">
            Financial literacy introduces concepts. Financial competency develops
            the judgment, discipline, and experience necessary to build wealth over a lifetime.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-5">
          <Link
            href="/course-catalog"
            className="rounded-xl bg-blue-600 px-10 py-4 text-lg font-bold hover:bg-blue-700"
          >
            Start Learning
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-white px-10 py-4 text-lg font-bold hover:bg-white hover:text-black"
          >
            Open Dashboard
          </Link>
          <Link
            href="/membership"
            className="rounded-xl border border-yellow-500 px-10 py-4 text-lg font-bold text-yellow-400 hover:bg-yellow-600 hover:text-white"
          >
            Upgrade Membership
          </Link>
        </div>
      </section>
    </main>
  );
}
