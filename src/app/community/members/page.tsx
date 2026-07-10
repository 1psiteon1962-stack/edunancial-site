import Link from "next/link";
import MemberCard from "@/components/community/MemberCard";
import { COMMUNITY_MEMBERS, BADGE_LABELS, BADGE_COLORS } from "@/data/community";
import type { ReputationBadge } from "@/types/community";

export const metadata = {
  title: "Community Members | Edunancial",
  description:
    "Meet the most active and helpful members of the Edunancial financial literacy community.",
};

const BADGE_ORDER: ReputationBadge[] = [
  "champion",
  "expert",
  "trusted",
  "contributor",
  "newcomer",
];

const REPUTATION_MILESTONES = [
  { points: 100, label: "First Contribution", icon: "🌱", badge: "newcomer" as ReputationBadge },
  { points: 500, label: "Active Contributor", icon: "📣", badge: "contributor" as ReputationBadge },
  { points: 1500, label: "Trusted Member", icon: "✅", badge: "trusted" as ReputationBadge },
  { points: 3000, label: "Expert Recognition", icon: "🎓", badge: "expert" as ReputationBadge },
  { points: 5000, label: "Community Champion", icon: "🏆", badge: "champion" as ReputationBadge },
];

export default function MembersPage() {
  const sortedMembers = [...COMMUNITY_MEMBERS].sort(
    (a, b) => b.reputationPoints - a.reputationPoints
  );

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">

        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-400">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/community" className="hover:text-yellow-400 transition-colors">
                Community
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li className="text-slate-200" aria-current="page">Members</li>
          </ol>
        </nav>

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400 text-sm">
          COMMUNITY
        </p>
        <h1 className="mt-4 text-5xl font-black">
          Member Highlights
        </h1>
        <p className="mt-4 text-xl text-slate-300 max-w-2xl">
          Our top contributors share their knowledge, answer questions, and
          help the entire community grow financially stronger.
        </p>

        {/* Reputation System Overview */}
        <section
          className="mt-16 rounded-xl bg-slate-800 p-8"
          aria-labelledby="reputation-heading"
        >
          <h2 id="reputation-heading" className="text-2xl font-black mb-6">
            🏅 Reputation System
          </h2>
          <p className="text-slate-300 mb-8">
            Earn reputation points by posting helpful discussions, receiving
            likes, and having your answers marked as helpful. Climb the ranks
            and earn community recognition.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {REPUTATION_MILESTONES.map((milestone) => (
              <div
                key={milestone.badge}
                className={`rounded-lg border p-4 text-center ${BADGE_COLORS[milestone.badge]}`}
              >
                <div className="text-3xl mb-2" aria-hidden="true">
                  {milestone.icon}
                </div>
                <div
                  className={`text-xs font-bold rounded-full border px-2 py-0.5 inline-block ${BADGE_COLORS[milestone.badge]}`}
                >
                  {BADGE_LABELS[milestone.badge]}
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  {milestone.points.toLocaleString()}+ points
                </div>
                <div className="mt-1 text-xs font-semibold">
                  {milestone.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to earn points */}
        <section
          className="mt-10 rounded-xl bg-blue-900/20 border border-blue-500/30 p-8"
          aria-labelledby="earn-heading"
        >
          <h2 id="earn-heading" className="text-xl font-black mb-4 text-blue-300">
            How to Earn Reputation Points
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm text-slate-300">
            {[
              { action: "Post a discussion", points: "+10 pts" },
              { action: "Receive a like on your post", points: "+5 pts" },
              { action: "Answer marked as helpful", points: "+25 pts" },
              { action: "Community milestone badge", points: "+50 pts" },
              { action: "Expert recognition by staff", points: "+100 pts" },
              { action: "30-day posting streak", points: "+30 pts" },
            ].map(({ action, points }) => (
              <div key={action} className="flex justify-between gap-2 rounded-lg bg-slate-800 px-4 py-3">
                <span>{action}</span>
                <span className="text-yellow-400 font-bold shrink-0">{points}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Member list */}
        <div className="mt-16">
          <h2 className="text-2xl font-black mb-6">🏆 Top Contributors</h2>
          <div
            className="space-y-4"
            role="list"
            aria-label="Top community members"
          >
            {sortedMembers.map((member, i) => (
              <div key={member.id} role="listitem">
                <MemberCard member={member} rank={i + 1} />
              </div>
            ))}
          </div>
        </div>

        {/* Badge legend */}
        <section
          className="mt-16 rounded-xl bg-slate-800 p-8"
          aria-labelledby="badges-heading"
        >
          <h2 id="badges-heading" className="text-2xl font-black mb-6">
            🎖️ Badge Tiers
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BADGE_ORDER.map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-3 rounded-lg bg-slate-700 p-4"
              >
                <span
                  className={`inline-block rounded-full border px-3 py-1 text-sm font-semibold ${BADGE_COLORS[badge]}`}
                >
                  {BADGE_LABELS[badge]}
                </span>
                <span className="text-sm text-slate-400">
                  {badge === "newcomer" && "New to the community"}
                  {badge === "contributor" && "Regularly posts helpful content"}
                  {badge === "trusted" && "Verified, consistent contributor"}
                  {badge === "expert" && "Recognized financial knowledge"}
                  {badge === "champion" && "Top community leader"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 text-center rounded-xl bg-yellow-400/10 border border-yellow-400/30 p-10">
          <h2 className="text-3xl font-black text-yellow-400 mb-3">
            Become a Top Contributor
          </h2>
          <p className="text-slate-300 mb-6 max-w-lg mx-auto">
            Join the community, share your financial knowledge, and earn your
            place among our most trusted members.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-yellow-400 px-8 py-4 font-bold text-black hover:bg-yellow-300 transition-colors"
            >
              Join Free
            </Link>
            <Link
              href="/community/new"
              className="rounded-xl border border-yellow-400/50 px-8 py-4 font-bold text-yellow-400 hover:border-yellow-400 transition-colors"
            >
              Start a Discussion
            </Link>
          </div>
        </div>

      </section>
    </main>
  );
}
