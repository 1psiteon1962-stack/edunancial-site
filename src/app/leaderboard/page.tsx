import type { Metadata } from "next";
import LeaderboardTable from "@/components/gamification/LeaderboardTable";
import type { LeaderboardEntry } from "@/lib/gamification/types";
import { getActiveLeaderboards, LEADERBOARD_SCOPE_LABELS } from "@/lib/gamification/leaderboardConfig";

export const metadata: Metadata = {
  title: "Leaderboard | Edunancial",
  description:
    "See the top financial learners on Edunancial. Compete, get inspired, and climb the leaderboard.",
};

// Demo leaderboard data — replace with real data from your backend/Supabase
const demoLeaders: LeaderboardEntry[] = [
  { rank: 1, userId: "u1", displayName: "Maria", points: 4820, achievementCount: 10, streak: 42 },
  { rank: 2, userId: "u2", displayName: "David", points: 4265, achievementCount: 9, streak: 35 },
  { rank: 3, userId: "u3", displayName: "Sophia", points: 3910, achievementCount: 8, streak: 28 },
  { rank: 4, userId: "u4", displayName: "James", points: 3698, achievementCount: 7, streak: 21 },
  { rank: 5, userId: "u5", displayName: "Olivia", points: 3455, achievementCount: 6, streak: 14 },
  { rank: 6, userId: "u6", displayName: "Daniel", points: 3110, achievementCount: 5, streak: 10 },
  { rank: 7, userId: "u7", displayName: "Emma",   points: 2898, achievementCount: 4, streak: 7  },
  { rank: 8, userId: "u8", displayName: "Michael",points: 2550, achievementCount: 3, streak: 5  },
];

export default function LeaderboardPage() {
  const activeBoards = getActiveLeaderboards();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          LEADERBOARD
        </p>

        <h1 className="mt-6 text-5xl font-black sm:text-6xl">
          Top Financial Learners
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
          Compete with learners around the world. Earn points by completing
          lessons, quizzes, and courses to climb the leaderboard.
        </p>

        {/* Scope tabs */}
        <nav
          className="mt-12 flex flex-wrap gap-3"
          aria-label="Leaderboard scope"
        >
          {activeBoards.map((board) => (
            <span
              key={board.scope}
              className="rounded-full bg-slate-800 px-5 py-2 text-sm font-semibold text-white first:bg-yellow-500 first:text-black"
            >
              {LEADERBOARD_SCOPE_LABELS[board.scope]}
            </span>
          ))}
        </nav>

        {/* Active leaderboard (global shown by default) */}
        <div className="mt-10">
          <LeaderboardTable entries={demoLeaders} scope="global" />
        </div>

        <p className="mt-8 text-sm text-slate-500 text-center">
          Leaderboard updates every 60 minutes. Organization and Friends boards
          coming soon.
        </p>
      </section>
    </main>
  );
}
