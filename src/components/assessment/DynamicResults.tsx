"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  calculateCompetencyScores,
  competencyLevel,
  CompetencyScores,
} from "@/lib/assessment/scoring";
import { generateLearningRoadmap } from "@/lib/assessment/roadmap";
import { generateCourseRecommendations } from "@/lib/assessment/recommendations";
import { generateCertificates } from "@/lib/assessment/certificates";
import {
  loadAllRawAnswers,
  buildAssessmentAnswers,
  saveResults,
  clearAssessmentAnswers,
} from "@/lib/assessment/store";
import { SECTIONS } from "@/lib/assessment/questions";
import type { CompetencyArea } from "@/lib/assessment/scoring";

function buildQuestionAreaMap(): Record<string, CompetencyArea> {
  const map: Record<string, CompetencyArea> = {};
  for (const section of SECTIONS) {
    for (const q of section.questions) {
      map[q.id] = q.area;
    }
  }
  return map;
}

const AREA_LABELS: Record<CompetencyArea, string> = {
  personalFinance: "Personal Finance",
  investing: "Paper Assets",
  realEstate: "Real Estate",
  business: "Business",
  riskManagement: "Risk Management",
  financialProfile: "Financial Profile",
};

const AREA_COLORS: Record<CompetencyArea, string> = {
  personalFinance: "bg-blue-700",
  investing: "bg-white text-slate-900",
  realEstate: "bg-red-700",
  business: "bg-blue-900",
  riskManagement: "bg-green-700",
  financialProfile: "bg-purple-700",
};

function ScoreBar({ score, label }: { score: number; label: string }) {
  const color =
    score >= 85
      ? "bg-green-500"
      : score >= 70
      ? "bg-blue-500"
      : score >= 55
      ? "bg-yellow-500"
      : score >= 40
      ? "bg-orange-500"
      : "bg-red-500";

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-300">{label}</span>
        <span className="font-bold">{score}%</span>
      </div>
      <div className="h-3 w-full rounded-full bg-slate-700">
        <div
          className={`h-3 rounded-full ${color} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function DynamicResults() {
  const [scores, setScores] = useState<CompetencyScores | null>(null);
  const [hasAnswers, setHasAnswers] = useState<boolean | null>(null);

  useEffect(() => {
    const raw = loadAllRawAnswers();
    const answerCount = Object.keys(raw).length;

    if (answerCount === 0) {
      setHasAnswers(false);
      return;
    }

    setHasAnswers(true);
    const areaMap = buildQuestionAreaMap();
    const answers = buildAssessmentAnswers(raw, areaMap);
    const computed = calculateCompetencyScores(answers);
    setScores(computed);

    saveResults({
      completedAt: new Date().toISOString(),
      overall: computed.overall,
      personalFinance: computed.personalFinance,
      investing: computed.investing,
      realEstate: computed.realEstate,
      business: computed.business,
      riskManagement: computed.riskManagement,
      financialProfile: computed.financialProfile,
    });
  }, []);

  if (hasAnswers === null) {
    return (
      <main className="min-h-screen bg-[#08101f] text-white flex items-center justify-center">
        <p className="text-xl text-slate-400">Loading your results…</p>
      </main>
    );
  }

  if (!hasAnswers || !scores) {
    return (
      <main className="min-h-screen bg-[#08101f] text-white">
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-5xl font-black">No Assessment Found</h1>
          <p className="mt-8 text-xl text-slate-300">
            You haven't completed an assessment yet. Take the assessment first
            to receive your personalized Financial Competency Report.
          </p>
          <Link
            href="/assessment"
            className="mt-12 inline-block rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
          >
            Start Assessment
          </Link>
        </section>
      </main>
    );
  }

  const level = competencyLevel(scores.overall);
  const roadmap = generateLearningRoadmap(scores);
  const recommendations = generateCourseRecommendations(scores);
  const certificates = generateCertificates(scores);
  const earnedCerts = certificates.filter((c) => c.earned);

  const categoryAreas: CompetencyArea[] = [
    "personalFinance",
    "investing",
    "realEstate",
    "business",
    "riskManagement",
    "financialProfile",
  ];

  const categoryScores: Record<CompetencyArea, number> = {
    personalFinance: scores.personalFinance,
    investing: scores.investing,
    realEstate: scores.realEstate,
    business: scores.business,
    riskManagement: scores.riskManagement,
    financialProfile: scores.financialProfile,
  };

  const sortedByScore = [...categoryAreas].sort(
    (a, b) => categoryScores[b] - categoryScores[a]
  );
  const strengths = sortedByScore.slice(0, 2);
  const opportunities = sortedByScore.slice(-2);

  const overallGradient =
    scores.overall >= 85
      ? "from-green-700 via-blue-700 to-green-700"
      : scores.overall >= 70
      ? "from-blue-700 via-blue-600 to-blue-700"
      : scores.overall >= 55
      ? "from-yellow-700 via-yellow-600 to-yellow-700"
      : "from-orange-700 via-red-700 to-orange-700";

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="font-bold uppercase tracking-[0.45em] text-green-400">
          ASSESSMENT RESULTS
        </p>

        <h1 className="mt-8 text-7xl font-black">
          Your Financial
          <br />
          Competency Report
        </h1>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">
          Congratulations on completing your assessment. Your Financial
          Competency Report identifies your strengths, your opportunities
          for improvement, and recommends the most effective learning path
          based upon your current competency level.
        </p>

        {/* Overall Score */}
        <div className={`mt-20 rounded-2xl bg-gradient-to-r ${overallGradient} p-12 text-center`}>
          <p className="text-xl font-bold uppercase tracking-[0.4em]">
            OVERALL FINANCIAL COMPETENCY SCORE
          </p>
          <h2 className="mt-8 text-8xl font-black">{scores.overall}</h2>
          <p className="mt-8 text-3xl font-bold">{level} Financial Competency</p>
          {earnedCerts.length > 0 && (
            <p className="mt-4 text-xl text-green-200">
              🎓 {earnedCerts.length} certificate{earnedCerts.length > 1 ? "s" : ""} earned
            </p>
          )}
        </div>

        {/* Category Scores Grid */}
        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categoryAreas.map((area) => {
            const score = categoryScores[area];
            const lvl = competencyLevel(score);
            const colorClasses = AREA_COLORS[area];
            return (
              <div key={area} className={`rounded-xl ${colorClasses} p-10`}>
                <h3 className="text-2xl font-black">{AREA_LABELS[area]}</h3>
                <p className="mt-8 text-5xl font-black">{score}%</p>
                <p className="mt-3 text-lg opacity-80">{lvl}</p>
              </div>
            );
          })}
        </div>

        {/* Score Bars */}
        <div className="mt-20 rounded-2xl bg-slate-900 p-10">
          <h2 className="text-4xl font-black">Competency Breakdown</h2>
          <div className="mt-10 space-y-5">
            {categoryAreas.map((area) => (
              <ScoreBar
                key={area}
                score={categoryScores[area]}
                label={AREA_LABELS[area]}
              />
            ))}
          </div>
        </div>

        {/* Strengths & Opportunities */}
        <div className="mt-20 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-slate-900 p-10">
            <h2 className="text-4xl font-black">Your Greatest Strengths</h2>
            <ul className="mt-10 space-y-5 text-xl text-slate-300">
              {strengths.map((area) => (
                <li key={area}>
                  ✓ {AREA_LABELS[area]} — {categoryScores[area]}%
                </li>
              ))}
              {scores.overall >= 85 && (
                <li>✓ Overall advanced financial competency</li>
              )}
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-900 p-10">
            <h2 className="text-4xl font-black">Greatest Opportunities</h2>
            <ul className="mt-10 space-y-5 text-xl text-slate-300">
              {opportunities.map((area) => (
                <li key={area}>
                  • Improve {AREA_LABELS[area]} — currently {categoryScores[area]}%
                </li>
              ))}
              <li>• Continue building financial habits and systems</li>
            </ul>
          </div>
        </div>

        {/* Personalized Learning Roadmap */}
        {roadmap.length > 0 && (
          <div className="mt-20 rounded-2xl bg-[#111827] p-10">
            <h2 className="text-4xl font-black">Personalized Learning Roadmap</h2>
            <p className="mt-8 text-xl leading-9 text-slate-300">
              Based upon your assessment, Edunancial recommends concentrating
              first on your lowest competency areas while continuing to
              strengthen your existing skills.
            </p>
            <div className="mt-12 space-y-6">
              {roadmap.map((item) => (
                <div key={item.priority} className="rounded-xl bg-slate-900 p-8">
                  <h3 className="text-2xl font-black">
                    Priority {item.priority}
                  </h3>
                  <p className="mt-2 text-xl font-semibold text-blue-400">
                    {item.title}
                  </p>
                  <p className="mt-4 text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Course Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-20 rounded-2xl border border-blue-600 bg-slate-900 p-10">
            <h2 className="text-4xl font-black">Recommended Next Courses</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {recommendations.map((rec) => (
                <div key={rec.id} className="rounded-xl border border-slate-700 p-6">
                  <h3 className="text-2xl font-bold">{rec.title}</h3>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-blue-400">
                    {rec.category}
                  </p>
                  <p className="mt-4 text-slate-300">{rec.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificates */}
        <div className="mt-20 rounded-2xl bg-slate-900 p-10">
          <h2 className="text-4xl font-black">Certificates</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className={`rounded-xl p-6 border ${
                  cert.earned
                    ? "border-green-500 bg-green-900/20"
                    : "border-slate-700 opacity-50"
                }`}
              >
                <p className="text-lg font-bold">{cert.title}</p>
                <p className="mt-1 text-sm text-slate-400">{cert.category}</p>
                <p className="mt-3 text-sm font-semibold">
                  {cert.earned ? (
                    <span className="text-green-400">✓ Earned</span>
                  ) : (
                    <span className="text-slate-500">
                      Requires {cert.minimumScore}%
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-20 rounded-2xl bg-gradient-to-r from-green-700 to-blue-700 p-12 text-center">
          <h2 className="text-5xl font-black">Keep Building Financial Competency</h2>
          <p className="mx-auto mt-8 max-w-4xl text-2xl leading-10">
            Financial literacy introduces concepts. Financial competency
            develops the judgment, discipline, habits, and experience
            necessary to build wealth over a lifetime.
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-20 flex flex-wrap justify-center gap-6">
          <Link
            href="/courses"
            className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
          >
            Begin Learning
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-white px-10 py-5 text-xl font-bold hover:bg-white hover:text-black"
          >
            Open Dashboard
          </Link>
          <Link
            href="/passport"
            className="rounded-xl border border-green-500 px-10 py-5 text-xl font-bold hover:bg-green-600"
          >
            View Passport
          </Link>
          <button
            onClick={() => {
              clearAssessmentAnswers();
              window.location.href = "/assessment";
            }}
            className="rounded-xl border border-slate-600 px-10 py-5 text-xl font-bold text-slate-400 hover:border-slate-400 hover:text-white"
          >
            Retake Assessment
          </button>
        </div>

      </section>
    </main>
  );
}
