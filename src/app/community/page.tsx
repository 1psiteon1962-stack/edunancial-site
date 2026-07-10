import Link from "next/link";
import DiscussionCard from "@/components/community/DiscussionCard";
import ForumCategoryCard from "@/components/community/ForumCategoryCard";
import MemberCard from "@/components/community/MemberCard";
import CommunityStatsBar from "@/components/community/CommunityStatsBar";
import {
  FORUM_CATEGORIES,
  COMMUNITY_MEMBERS,
  COMMUNITY_STATS,
  getRecentDiscussions,
  getPopularDiscussions,
  getFeaturedDiscussions,
  getStaffPicks,
} from "@/data/community";

export const metadata = {
  title: "Community | Edunancial",
  description:
    "Join the Edunancial community. Ask questions, share experiences, and learn financial literacy alongside thousands of members.",
};

export default function CommunityPage() {
  const recentDiscussions = getRecentDiscussions();
  const popularDiscussions = getPopularDiscussions();
  const featuredDiscussions = getFeaturedDiscussions().slice(0, 3);
  const staffPicks = getStaffPicks().slice(0, 3);
  const memberHighlights = COMMUNITY_MEMBERS.slice(0, 4);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          COMMUNITY
        </p>
        <h1 className="mt-6 text-5xl font-black md:text-6xl">
          Learn Together.
          <br />
          Grow Together.
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-slate-300">
          Ask questions, share your financial journey, and learn from thousands
          of members building wealth through education.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/community/new"
            className="rounded-xl bg-yellow-400 px-8 py-4 font-bold text-black hover:bg-yellow-300 transition-colors"
          >
            Start a Discussion
          </Link>
          <Link
            href="/community/forum"
            className="rounded-xl border border-white/20 px-8 py-4 font-bold text-white hover:border-white/50 transition-colors"
          >
            Browse Forums
          </Link>
          <Link
            href="/community/search"
            className="rounded-xl border border-white/20 px-8 py-4 font-bold text-white hover:border-white/50 transition-colors"
          >
            Search Discussions
          </Link>
        </div>

        <div className="mt-16">
          <CommunityStatsBar stats={COMMUNITY_STATS} />
        </div>
      </section>

      {/* Forum Categories */}
      <section className="mx-auto max-w-6xl px-6 pb-20" aria-labelledby="categories-heading">
        <div className="flex items-center justify-between mb-8">
          <h2 id="categories-heading" className="text-3xl font-black">
            Discussion Forums
          </h2>
          <Link
            href="/community/forum"
            className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm transition-colors"
          >
            View all forums →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FORUM_CATEGORIES.slice(0, 6).map((cat) => (
            <ForumCategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </section>

      {/* Featured Topics */}
      <section
        className="bg-slate-900/50 py-20"
        aria-labelledby="featured-heading"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 id="featured-heading" className="text-3xl font-black">
              🔥 Featured Topics
            </h2>
          </div>
          <div className="space-y-4">
            {featuredDiscussions.map((d) => (
              <DiscussionCard key={d.id} discussion={d} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent + Popular split */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2">

          {/* Recent Discussions */}
          <div aria-labelledby="recent-heading">
            <div className="flex items-center justify-between mb-6">
              <h2 id="recent-heading" className="text-2xl font-black">
                🕒 Recent Discussions
              </h2>
              <Link
                href="/community/forum"
                className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm transition-colors"
              >
                See all →
              </Link>
            </div>
            <div className="space-y-4">
              {recentDiscussions.slice(0, 4).map((d) => (
                <DiscussionCard key={d.id} discussion={d} />
              ))}
            </div>
          </div>

          {/* Popular Discussions */}
          <div aria-labelledby="popular-heading">
            <div className="flex items-center justify-between mb-6">
              <h2 id="popular-heading" className="text-2xl font-black">
                📈 Popular Discussions
              </h2>
            </div>
            <div className="space-y-4">
              {popularDiscussions.map((d) => (
                <DiscussionCard key={d.id} discussion={d} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Staff Picks */}
      <section
        className="bg-slate-900/50 py-20"
        aria-labelledby="staff-picks-heading"
      >
        <div className="mx-auto max-w-6xl px-6">
          <h2 id="staff-picks-heading" className="text-3xl font-black mb-8">
            ⭐ Staff Picks
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {staffPicks.map((d) => (
              <DiscussionCard key={d.id} discussion={d} />
            ))}
          </div>
        </div>
      </section>

      {/* Member Highlights */}
      <section className="mx-auto max-w-6xl px-6 py-20" aria-labelledby="members-heading">
        <div className="flex items-center justify-between mb-8">
          <h2 id="members-heading" className="text-3xl font-black">
            🏆 Member Highlights
          </h2>
          <Link
            href="/community/members"
            className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm transition-colors"
          >
            See all members →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {memberHighlights.map((member, i) => (
            <MemberCard key={member.id} member={member} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 py-20 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-4xl font-black">
            Join the Conversation
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Connect with thousands of members on a shared journey toward
            financial freedom and literacy.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-white px-8 py-4 font-bold text-blue-700 hover:bg-blue-50 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/community/forum"
              className="rounded-xl border border-white/40 px-8 py-4 font-bold text-white hover:border-white transition-colors"
            >
              Browse as Guest
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
