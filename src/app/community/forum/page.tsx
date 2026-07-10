import Link from "next/link";
import ForumCategoryCard from "@/components/community/ForumCategoryCard";
import { FORUM_CATEGORIES } from "@/data/community";

export const metadata = {
  title: "Discussion Forums | Edunancial Community",
  description:
    "Browse financial literacy discussion forums covering budgeting, investing, credit, retirement, taxes, and more.",
};

export default function ForumListingPage() {
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
            <li className="text-slate-200" aria-current="page">Forums</li>
          </ol>
        </nav>

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          DISCUSSION FORUMS
        </p>

        <h1 className="mt-6 text-5xl font-black md:text-6xl">
          Browse All Forums
        </h1>

        <p className="mt-6 max-w-2xl text-xl text-slate-300">
          Choose a topic area to explore discussions, ask questions, and share
          your knowledge with the community.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/community/new"
            className="rounded-xl bg-yellow-400 px-8 py-4 font-bold text-black hover:bg-yellow-300 transition-colors"
          >
            Start a Discussion
          </Link>
          <Link
            href="/community/search"
            className="rounded-xl border border-white/20 px-8 py-4 font-bold text-white hover:border-white/50 transition-colors"
          >
            🔍 Search Discussions
          </Link>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {FORUM_CATEGORIES.map((cat) => (
            <div key={cat.slug} role="listitem">
              <ForumCategoryCard category={cat} />
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-blue-700/20 border border-blue-500/30 p-8 text-center">
          <h2 className="text-2xl font-black">
            Community Guidelines
          </h2>
          <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
            Our community is built on respect, accuracy, and mutual support.
            Always share verified information, be kind to newcomers, and report
            any content that violates our standards.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/community/new"
              className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500 transition-colors"
            >
              Post a Discussion
            </Link>
          </div>
        </div>

      </section>
    </main>
  );
}
