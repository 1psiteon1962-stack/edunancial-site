import type { Metadata } from "next";
import PointsBadge from "@/components/gamification/PointsBadge";
import type { UserPoints } from "@/lib/gamification/types";

export const metadata: Metadata = {
  title: "Points | Edunancial",
  description:
    "Track your Edunancial points. Earn points by completing lessons, quizzes, and courses.",
};

// Demo points data — replace with real user data from your auth/data layer
const demoPoints: UserPoints = {
  userId: "demo",
  totalPoints: 1240,
  weeklyPoints: 185,
  monthlyPoints: 520,
  transactions: [
    { id: "tx1", userId: "demo", event: "daily_login", points: 5, createdAt: new Date().toISOString() },
    { id: "tx2", userId: "demo", event: "lesson_complete", points: 20, createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: "tx3", userId: "demo", event: "quiz_complete", points: 30, createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: "tx4", userId: "demo", event: "course_complete", points: 150, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: "tx5", userId: "demo", event: "certificate_earned", points: 200, createdAt: new Date(Date.now() - 172800000).toISOString() },
  ],
};

export default function PointsPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-3xl px-6 py-24">
        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          POINTS
        </p>

        <h1 className="mt-6 text-5xl font-black sm:text-6xl">
          Your Points
        </h1>

        <p className="mt-6 text-lg text-slate-400 leading-relaxed">
          Earn points for every learning activity. Points contribute to your
          leaderboard ranking and unlock special rewards.
        </p>

        <div className="mt-14">
          <PointsBadge points={demoPoints} expanded />
        </div>
      </section>
    </main>
  );
}
