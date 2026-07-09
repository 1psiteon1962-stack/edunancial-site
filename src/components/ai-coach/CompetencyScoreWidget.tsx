import { CompetencyScores, CompetencyLevel } from "@/types/ai-coach";

interface Props {
  scores: CompetencyScores;
  level: CompetencyLevel;
}

const AREA_LABELS: Record<keyof Omit<CompetencyScores, "overall">, string> = {
  personalFinance: "Personal Finance",
  investing: "Investing",
  realEstate: "Real Estate",
  business: "Business",
  riskManagement: "Risk Mgmt",
  financialProfile: "Profile",
};

const AREA_COLORS: Record<keyof Omit<CompetencyScores, "overall">, string> = {
  personalFinance: "bg-green-500",
  investing: "bg-blue-500",
  realEstate: "bg-yellow-500",
  business: "bg-red-500",
  riskManagement: "bg-purple-500",
  financialProfile: "bg-cyan-500",
};

const LEVEL_COLORS: Record<CompetencyLevel, string> = {
  Expert: "text-yellow-400",
  Proficient: "text-green-400",
  Competent: "text-blue-400",
  Developing: "text-orange-400",
  Beginner: "text-red-400",
};

export default function CompetencyScoreWidget({ scores, level }: Props) {
  const areas = Object.keys(AREA_LABELS) as Array<
    keyof Omit<CompetencyScores, "overall">
  >;

  return (
    <div className="rounded-2xl bg-slate-900 p-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
            Financial Competency Score
          </p>
          <p
            className={`mt-2 text-7xl font-black ${LEVEL_COLORS[level]}`}
            aria-label={`Competency score: ${scores.overall} out of 100`}
          >
            {scores.overall}
          </p>
          <p className={`mt-1 text-xl font-bold ${LEVEL_COLORS[level]}`}>
            {level}
          </p>
        </div>
        <div className="relative flex h-28 w-28 items-center justify-center">
          <svg
            className="absolute inset-0"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#1e293b"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="10"
              strokeDasharray={`${(scores.overall / 100) * 283} 283`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <span className="z-10 text-2xl font-black">{scores.overall}</span>
        </div>
      </div>

      <div className="mt-8 space-y-3" role="list" aria-label="Competency areas">
        {areas.map((area) => (
          <div key={area} role="listitem">
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-slate-300">{AREA_LABELS[area]}</span>
              <span className="font-bold">{scores[area]}</span>
            </div>
            <div
              className="h-2 w-full rounded-full bg-slate-700"
              role="progressbar"
              aria-valuenow={scores[area]}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${AREA_LABELS[area]}: ${scores[area]}%`}
            >
              <div
                className={`h-2 rounded-full ${AREA_COLORS[area]} transition-all duration-500`}
                style={{ width: `${scores[area]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
