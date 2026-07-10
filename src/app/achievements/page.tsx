import type { Metadata } from "next";
import AchievementGrid from "@/components/gamification/AchievementGrid";
import { ACHIEVEMENT_DEFINITIONS } from "@/lib/gamification/achievements";
import type { UserAchievement, UserProgress } from "@/lib/gamification/types";
import { evaluateAchievements } from "@/lib/gamification/gamificationEngine";

export const metadata: Metadata = {
  title: "Achievements | Edunancial",
  description:
    "Track your Edunancial achievements and badges. Earn points and unlock recognition as you build financial competency.",
};

// Demo progress snapshot — replace with real user data from your auth/data layer
const demoProgress: UserProgress = {
  userId: "demo",
  totalLogins: 1,
  coursesStarted: 1,
  coursesCompleted: 0,
  lessonsCompleted: 0,
  quizzesCompleted: 0,
  calculatorUses: 0,
  certificatesEarned: 0,
  currentStreak: 0,
  longestStreak: 0,
  categoryProgress: {},
};

const demoEarned: UserAchievement[] = [
  { achievementId: "first_login", earned: true, earnedAt: new Date().toISOString() },
  { achievementId: "first_course_started", earned: true, earnedAt: new Date().toISOString() },
];

export default function AchievementsPage() {
  const achievementStates = evaluateAchievements(demoProgress, demoEarned);
  const achievements = ACHIEVEMENT_DEFINITIONS.map((def) => ({
    definition: def,
    state:
      achievementStates.find((s) => s.achievementId === def.id) ?? {
        achievementId: def.id,
        earned: false,
        progress: 0,
      },
  }));

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          ACHIEVEMENTS
        </p>

        <h1 className="mt-6 text-5xl font-black sm:text-6xl">
          Your Progress
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
          Earn achievements as you learn, build habits, and master financial topics.
          Every achievement unlocks points and recognition on the leaderboard.
        </p>

        <div className="mt-16">
          <AchievementGrid achievements={achievements} />
        </div>
      </section>
    </main>
  );
}
