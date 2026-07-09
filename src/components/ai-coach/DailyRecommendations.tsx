import { Recommendation } from "@/types/ai-coach";
import RecommendationCard from "./RecommendationCard";
import Link from "next/link";

interface Props {
  recommendations: Recommendation[];
  compact?: boolean;
}

export default function DailyRecommendations({
  recommendations,
  compact = false,
}: Props) {
  const displayed = compact ? recommendations.slice(0, 3) : recommendations;

  return (
    <section aria-labelledby="recommendations-heading">
      <div className="mb-5 flex items-center justify-between">
        <h2 id="recommendations-heading" className="text-2xl font-black">
          Daily Recommendations
        </h2>
        {compact && (
          <Link
            href="/ai-coach/recommendations"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            View All
          </Link>
        )}
      </div>

      {displayed.length === 0 ? (
        <div className="rounded-xl bg-slate-900 p-6 text-slate-400">
          <p>No recommendations yet. Complete your assessment to unlock personalized suggestions.</p>
          <Link
            href="/assessment"
            className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          >
            Start Assessment →
          </Link>
        </div>
      ) : (
        <ul
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Recommendations"
        >
          {displayed.map((rec) => (
            <li key={rec.id}>
              <RecommendationCard recommendation={rec} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
