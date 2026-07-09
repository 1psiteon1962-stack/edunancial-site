import Link from "next/link";

interface Props {
  memberName: string;
  membershipLevel: string;
  competencyScore: number | null;
  assessmentCompleted: boolean;
  learningStreak: number;
}

export default function PersonalizedWelcome({
  memberName,
  membershipLevel,
  competencyScore,
  assessmentCompleted,
  learningStreak,
}: Props) {
  return (
    <section
      className="rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 p-8 md:p-12"
      aria-labelledby="welcome-heading"
    >
      <p className="text-sm font-bold uppercase tracking-widest text-blue-300">
        AI Financial Coach
      </p>

      <h1
        id="welcome-heading"
        className="mt-3 text-4xl font-black md:text-5xl"
      >
        Welcome back, {memberName}
      </h1>

      <p className="mt-3 text-lg text-slate-300">
        {membershipLevel} Member
      </p>

      <div className="mt-8 flex flex-wrap gap-6">
        {competencyScore !== null ? (
          <div className="rounded-xl bg-white/10 px-6 py-4 text-center">
            <p className="text-sm text-slate-300">Competency Score</p>
            <p
              className="text-4xl font-black text-yellow-400"
              aria-label={`Competency score: ${competencyScore}`}
            >
              {competencyScore}
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-white/10 px-6 py-4">
            <p className="text-sm text-slate-300">Competency Score</p>
            <p className="mt-1 text-xl font-bold text-slate-400">
              Not yet assessed
            </p>
          </div>
        )}

        <div className="rounded-xl bg-white/10 px-6 py-4 text-center">
          <p className="text-sm text-slate-300">Learning Streak</p>
          <p className="text-4xl font-black text-orange-400" aria-label={`${learningStreak} day learning streak`}>
            🔥 {learningStreak}d
          </p>
        </div>
      </div>

      {!assessmentCompleted && (
        <div
          className="mt-6 rounded-xl border border-yellow-500/50 bg-yellow-500/10 p-5"
          role="alert"
        >
          <p className="font-bold text-yellow-400">
            Complete your assessment to unlock personalized recommendations
          </p>
          <Link
            href="/assessment"
            className="mt-3 inline-block rounded-lg bg-yellow-500 px-6 py-2 font-bold text-black hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Start Assessment →
          </Link>
        </div>
      )}
    </section>
  );
}
