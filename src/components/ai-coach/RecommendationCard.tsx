import Link from "next/link";
import { Recommendation, RecommendationPriority } from "@/types/ai-coach";

interface Props {
  recommendation: Recommendation;
}

const TYPE_ICONS: Record<string, string> = {
  course: "📚",
  book: "📖",
  article: "📄",
  video: "🎬",
  marketplaceProduct: "🛒",
  assessment: "📋",
  action: "⚡",
};

const PRIORITY_BADGE: Record<RecommendationPriority, { bg: string; text: string; label: string }> = {
  critical: { bg: "bg-red-900/50 border-red-500", text: "text-red-400", label: "Critical" },
  high: { bg: "bg-orange-900/30 border-orange-500", text: "text-orange-400", label: "High Priority" },
  medium: { bg: "bg-blue-900/30 border-blue-500", text: "text-blue-400", label: "Recommended" },
  low: { bg: "bg-slate-800 border-slate-600", text: "text-slate-400", label: "Suggested" },
};

function ConfidenceBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">Match</span>
      <div
        className="h-1.5 w-24 rounded-full bg-slate-700"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Recommendation confidence: ${score}%`}
      >
        <div
          className="h-1.5 rounded-full bg-blue-400"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-bold text-slate-300">{score}%</span>
    </div>
  );
}

export default function RecommendationCard({ recommendation: rec }: Props) {
  const icon = TYPE_ICONS[rec.type] ?? "💡";
  const badge = PRIORITY_BADGE[rec.priority];

  return (
    <article
      className={`rounded-xl border ${badge.bg} p-5 transition hover:scale-[1.01]`}
      aria-label={`${rec.type}: ${rec.title}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-2xl" aria-hidden="true">
          {icon}
        </span>
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-bold ${badge.bg} ${badge.text}`}
        >
          {badge.label}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-black leading-snug">{rec.title}</h3>

      <p className="mt-2 text-sm text-slate-300">{rec.description}</p>

      <div className="mt-4 rounded-lg bg-slate-800/60 p-3 text-xs text-slate-400">
        <span className="font-bold text-slate-300">Why this? </span>
        {rec.reason}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <ConfidenceBar score={rec.confidenceScore} />
        {rec.estimatedTimeMinutes && (
          <span className="text-xs text-slate-400">
            ⏱ {rec.estimatedTimeMinutes >= 60
              ? `${Math.round(rec.estimatedTimeMinutes / 60)}h`
              : `${rec.estimatedTimeMinutes}m`}
          </span>
        )}
      </div>

      {rec.actionUrl && (
        <Link
          href={rec.actionUrl}
          className="mt-4 block rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          View →
        </Link>
      )}
    </article>
  );
}
