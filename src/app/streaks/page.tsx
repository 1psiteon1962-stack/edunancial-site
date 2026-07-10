import type { Metadata } from "next";
import StreakWidget from "@/components/gamification/StreakWidget";
import type { UserStreaks } from "@/lib/gamification/types";
import { buildWeeklyActivity, buildMonthlyActivity } from "@/lib/gamification/streakEngine";

export const metadata: Metadata = {
  title: "Learning Streaks | Edunancial",
  description:
    "Track your daily, weekly, and monthly learning streaks on Edunancial. Build consistent financial education habits.",
};

// Demo streak data — replace with real user data from your auth/data layer
const today = new Date().toISOString().slice(0, 10);
const demoHistory = [
  { date: today, lessonsCompleted: 2 },
  { date: new Date(Date.now() - 86400000).toISOString().slice(0, 10), lessonsCompleted: 1 },
  { date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10), lessonsCompleted: 3 },
  { date: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10), lessonsCompleted: 2 },
  { date: new Date(Date.now() - 4 * 86400000).toISOString().slice(0, 10), lessonsCompleted: 1 },
  { date: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10), lessonsCompleted: 2 },
  { date: new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10), lessonsCompleted: 1 },
];

const demoStreaks: UserStreaks = {
  userId: "demo",
  currentStreak: 7,
  longestStreak: 14,
  weeklyActivity: buildWeeklyActivity(demoHistory),
  monthlyActivity: buildMonthlyActivity(demoHistory),
  lastActivityDate: today,
  history: demoHistory,
};

export default function StreaksPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-4xl px-6 py-24">
        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          LEARNING STREAKS
        </p>

        <h1 className="mt-6 text-5xl font-black sm:text-6xl">
          Build the Habit
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
          Daily learning is the fastest path to financial mastery. Track your
          streaks and stay consistent to unlock special achievements.
        </p>

        <div className="mt-14">
          <StreakWidget streaks={demoStreaks} />
        </div>

        {/* Streak milestone rewards */}
        <div className="mt-12 rounded-2xl bg-slate-900 p-8">
          <h2 className="text-2xl font-black">Streak Milestones</h2>
          <p className="mt-2 text-slate-400 text-sm">
            Reach these milestones to unlock achievements and bonus points.
          </p>

          <div className="mt-6 space-y-4">
            {[
              { days: 3, label: "3-Day Streak", reward: "Bonus 15 pts", icon: "🔥" },
              { days: 7, label: "7-Day Streak", reward: "7-Day Streak Achievement + 75 pts", icon: "🌟" },
              { days: 14, label: "14-Day Streak", reward: "Bonus 100 pts", icon: "💫" },
              { days: 30, label: "30-Day Streak", reward: "30-Day Streak Achievement + 300 pts", icon: "🏆" },
              { days: 100, label: "100-Day Streak", reward: "Legend status + 1000 pts", icon: "👑" },
            ].map((milestone) => {
              const reached = demoStreaks.longestStreak >= milestone.days;
              return (
                <div
                  key={milestone.days}
                  className={[
                    "flex items-center justify-between rounded-xl px-5 py-4",
                    reached ? "bg-green-900/40 ring-1 ring-green-600" : "bg-slate-800",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl" role="img" aria-label={milestone.label}>
                      {milestone.icon}
                    </span>
                    <div>
                      <p className="font-bold">{milestone.label}</p>
                      <p className="text-xs text-slate-400">{milestone.reward}</p>
                    </div>
                  </div>
                  {reached ? (
                    <span className="text-green-400 font-bold text-sm">✅ Reached</span>
                  ) : (
                    <span className="text-slate-500 text-sm">
                      {milestone.days - demoStreaks.longestStreak} days to go
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
