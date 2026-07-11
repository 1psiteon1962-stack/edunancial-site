import { MemberInsight, CompetencyTrend } from "@/types/ai-coach";
import { AREA_LABELS } from "@/lib/ai-coach/insight-engine";

interface Props {
  insight: MemberInsight;
}

function TrendArrow({ direction }: { direction: CompetencyTrend["direction"] }) {
  if (direction === "improving") {
    return <span className="text-green-400 font-bold" aria-label="Improving">↑</span>;
  }
  if (direction === "declining") {
    return <span className="text-red-400 font-bold" aria-label="Declining">↓</span>;
  }
  return <span className="text-slate-400" aria-label="Stable">→</span>;
}

export default function MemberInsightCard({ insight }: Props) {
  return (
    <div className="rounded-2xl bg-slate-900 p-6 space-y-8">
      <h2 className="text-2xl font-black">Member Insights</h2>

      {/* Strengths */}
      <section aria-labelledby="strengths-heading">
        <h3 id="strengths-heading" className="mb-4 text-lg font-bold text-green-400">
          ✅ Strengths
        </h3>
        <ul className="space-y-3">
          {insight.strengths.map((item) => (
            <li
              key={item.area}
              className="rounded-xl bg-slate-800 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">{item.label}</span>
                <span className="text-xl font-black text-green-400">
                  {item.score}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{item.note}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Weaknesses */}
      <section aria-labelledby="weaknesses-heading">
        <h3 id="weaknesses-heading" className="mb-4 text-lg font-bold text-red-400">
          ⚠️ Areas to Improve
        </h3>
        <ul className="space-y-3">
          {insight.weaknesses.map((item) => (
            <li
              key={item.area}
              className="rounded-xl bg-slate-800 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">{item.label}</span>
                <span className="text-xl font-black text-red-400">
                  {item.score}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{item.note}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Trends */}
      {insight.trends.length > 0 && (
        <section aria-labelledby="trends-heading">
          <h3 id="trends-heading" className="mb-4 text-lg font-bold text-blue-400">
            📈 Competency Trends
          </h3>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {insight.trends.map((trend) => (
              <li
                key={trend.area}
                className="rounded-xl bg-slate-800 px-4 py-3 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">{trend.label}</span>
                  <TrendArrow direction={trend.direction} />
                </div>
                {trend.changePercent !== 0 && (
                  <p
                    className={`mt-1 text-xs font-bold ${
                      trend.direction === "improving"
                        ? "text-green-400"
                        : trend.direction === "declining"
                        ? "text-red-400"
                        : "text-slate-400"
                    }`}
                  >
                    {trend.changePercent > 0 ? "+" : ""}
                    {trend.changePercent}pts
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Suggestions */}
      {insight.suggestions.length > 0 && (
        <section aria-labelledby="suggestions-heading">
          <h3 id="suggestions-heading" className="mb-4 text-lg font-bold text-yellow-400">
            💡 Improvement Suggestions
          </h3>
          <ul className="space-y-3">
            {insight.suggestions.slice(0, 4).map((sug) => (
              <li
                key={sug.id}
                className="rounded-xl bg-slate-800 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-yellow-400 font-bold text-sm">
                    {AREA_LABELS[sug.area]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-300">{sug.suggestion}</p>
                <p className="mt-2 text-xs text-green-400 font-bold">
                  Est. impact: {sug.estimatedImpact}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
