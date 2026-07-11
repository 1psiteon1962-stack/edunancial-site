import Link from "next/link";
import { AICoachAccess } from "@/lib/competency/types";

interface Props {
  access: AICoachAccess;
}

export default function AICoachAccessGate({ access }: Props) {
  if (access.unlocked) {
    return (
      <div className="rounded-2xl border border-green-500/40 bg-green-950/30 p-8">
        <p className="text-sm font-bold uppercase tracking-widest text-green-400">
          AI Coach — Unlocked
        </p>
        <h2 className="mt-3 text-2xl font-bold">
          Your AI Financial Coach Is Ready
        </h2>
        <p className="mt-4 text-slate-300">
          You&apos;ve reached {access.currentLevel} level. Your AI Coach is
          personalized to your current competency profile and learning history.
        </p>
        <Link
          href="/ai-coach"
          className="mt-6 inline-block rounded-xl bg-green-600 px-8 py-3 font-bold hover:bg-green-700"
        >
          Open AI Coach →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-8">
      <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
        AI Coach — Locked
      </p>
      <h2 className="mt-3 text-2xl font-bold">
        Unlock Your AI Financial Coach
      </h2>
      <p className="mt-4 text-slate-300">
        Reach <strong>{access.requiredLevel}</strong> level (score{" "}
        {access.requiredScore}+) to unlock your personalized AI Financial Coach.
        You need <strong>{access.pointsNeeded} more points</strong>.
      </p>
      <div className="mt-6 h-3 w-full rounded-full bg-slate-700">
        <div
          className="h-3 rounded-full bg-yellow-400 transition-all"
          style={{
            width: `${Math.min(
              100,
              (access.currentScore / access.requiredScore) * 100
            )}%`,
          }}
        />
      </div>
      <p className="mt-3 text-sm text-slate-400">
        Current score: {access.currentScore} / {access.requiredScore} required
      </p>
      <Link
        href="/assessment"
        className="mt-6 inline-block rounded-xl border border-yellow-500 px-8 py-3 font-bold hover:bg-yellow-500 hover:text-slate-950"
      >
        Take Assessment →
      </Link>
    </div>
  );
}
