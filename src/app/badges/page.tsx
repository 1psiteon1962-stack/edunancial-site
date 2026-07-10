import type { Metadata } from "next";
import { ACHIEVEMENT_DEFINITIONS } from "@/lib/gamification/achievements";
import type { AchievementTier } from "@/lib/gamification/types";

export const metadata: Metadata = {
  title: "Achievement Badges | Edunancial",
  description:
    "Explore all achievement badges available on Edunancial. Earn badges by completing courses, building streaks, and mastering financial topics.",
};

const TIER_RING: Record<AchievementTier, string> = {
  bronze: "ring-amber-600",
  silver: "ring-slate-400",
  gold: "ring-yellow-400",
  platinum: "ring-purple-400",
};

const TIER_TEXT: Record<AchievementTier, string> = {
  bronze: "text-amber-400",
  silver: "text-slate-300",
  gold: "text-yellow-400",
  platinum: "text-purple-300",
};

export default function BadgesPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          ACHIEVEMENT BADGES
        </p>

        <h1 className="mt-6 text-5xl font-black sm:text-6xl">
          Celebrate Progress
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
          Every badge represents a milestone in your financial education journey.
          Earn them all to become a Financial Literacy Master.
        </p>

        {/* Stats bar */}
        <div className="mt-12 flex flex-wrap gap-6">
          {(["bronze", "silver", "gold", "platinum"] as AchievementTier[]).map((tier) => {
            const count = ACHIEVEMENT_DEFINITIONS.filter((a) => a.tier === tier).length;
            return (
              <div
                key={tier}
                className={`rounded-xl bg-slate-900 px-6 py-4 ring-1 ${TIER_RING[tier]}`}
              >
                <p className={`text-2xl font-black ${TIER_TEXT[tier]}`}>{count}</p>
                <p className="text-xs text-slate-400 capitalize mt-0.5">{tier} Badges</p>
              </div>
            );
          })}
        </div>

        {/* Badge grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {ACHIEVEMENT_DEFINITIONS.map((badge) => (
            <article
              key={badge.id}
              className={`rounded-2xl bg-slate-900 p-6 text-center ring-1 ${TIER_RING[badge.tier]}`}
              aria-label={`${badge.title} badge`}
            >
              <div className="text-5xl" role="img" aria-label={badge.title}>
                {badge.icon}
              </div>

              <h2 className={`mt-4 text-lg font-black ${TIER_TEXT[badge.tier]}`}>
                {badge.title}
              </h2>

              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                {badge.description}
              </p>

              <div className="mt-4 flex items-center justify-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${TIER_TEXT[badge.tier]}`}>
                  {badge.tier}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-yellow-400 font-bold">+{badge.points} pts</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
