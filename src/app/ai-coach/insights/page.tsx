import type { Metadata } from "next";
import AICoachLayout from "@/components/ai-coach/AICoachLayout";
import MemberInsightCard from "@/components/ai-coach/MemberInsightCard";
import { deriveInsights, getDemoHistoricalScores } from "@/lib/ai-coach/insight-engine";
import { DEMO_SCORES } from "@/lib/ai-coach/coach-data-service";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Member Insights | AI Coach | Edunancial",
  description:
    "View your financial competency strengths, weaknesses, trends, and personalized improvement suggestions from your Edunancial AI Coach.",
};

export default function InsightsPage() {
  const history = getDemoHistoricalScores();
  const insight = deriveInsights(DEMO_SCORES, history);

  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <AICoachLayout activeHref="/ai-coach/insights">
      {/* Header */}
      <section aria-labelledby="insights-heading">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Member Insights
        </p>
        <h1 id="insights-heading" className="mt-3 text-5xl font-black">
          Your Financial Intelligence Report
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Understand your strengths, identify growth areas, and track your competency progress over time.
        </p>
      </section>

      {/* Overall score trend */}
      <div className="mt-8 rounded-2xl bg-slate-900 p-6">
        <h2 className="text-xl font-black">Overall Competency History</h2>
        <div className="mt-5 flex items-end gap-4" role="img" aria-label="Competency score history chart">
          {sortedHistory.map((record, i) => {
            const date = new Date(record.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            const height = Math.max(20, (record.overallScore / 100) * 160);
            const isLatest = i === sortedHistory.length - 1;
            return (
              <div key={record.date} className="flex flex-col items-center gap-2">
                <span
                  className="text-sm font-bold"
                  aria-label={`Score: ${record.overallScore}`}
                >
                  {record.overallScore}
                </span>
                <div
                  className={`w-16 rounded-t-xl ${isLatest ? "bg-blue-500" : "bg-slate-600"} transition-all`}
                  style={{ height: `${height}px` }}
                  aria-hidden="true"
                />
                <span className="text-xs text-slate-400">{date}</span>
              </div>
            );
          })}
          {/* Current */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-bold text-yellow-400">
              {DEMO_SCORES.overall}
            </span>
            <div
              className="w-16 rounded-t-xl bg-yellow-500 transition-all"
              style={{
                height: `${Math.max(20, (DEMO_SCORES.overall / 100) * 160)}px`,
              }}
              aria-hidden="true"
            />
            <span className="text-xs text-yellow-400 font-bold">Now</span>
          </div>
        </div>
      </div>

      {/* Area breakdown */}
      <div className="mt-8 rounded-2xl bg-slate-900 p-6">
        <h2 className="text-xl font-black mb-5">Current Area Scores</h2>
        <div className="space-y-4">
          {[
            { key: "personalFinance", label: "Personal Finance", score: DEMO_SCORES.personalFinance },
            { key: "investing", label: "Investing", score: DEMO_SCORES.investing },
            { key: "realEstate", label: "Real Estate", score: DEMO_SCORES.realEstate },
            { key: "business", label: "Business", score: DEMO_SCORES.business },
            { key: "riskManagement", label: "Risk Management", score: DEMO_SCORES.riskManagement },
            { key: "financialProfile", label: "Financial Profile", score: DEMO_SCORES.financialProfile },
          ].map(({ key, label, score }) => (
            <div key={key}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-slate-300">{label}</span>
                <span className="font-bold">{score}</span>
              </div>
              <div
                className="h-3 w-full rounded-full bg-slate-700"
                role="progressbar"
                aria-valuenow={score}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${label}: ${score}%`}
              >
                <div
                  className={`h-3 rounded-full transition-all ${
                    score >= 80
                      ? "bg-green-500"
                      : score >= 65
                      ? "bg-blue-500"
                      : score >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights card */}
      <div className="mt-8">
        <MemberInsightCard insight={insight} />
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/ai-coach"
          className="rounded-xl border border-slate-600 px-6 py-3 font-bold text-slate-300 hover:border-white hover:text-white"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </AICoachLayout>
  );
}
