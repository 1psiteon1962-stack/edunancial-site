import { notFound } from "next/navigation";
import Link from "next/link";
import DiscussionCard from "@/components/community/DiscussionCard";
import {
  getCategoryMeta,
  getDiscussionsByCategory,
  FORUM_CATEGORIES,
} from "@/data/community";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return FORUM_CATEGORIES.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const meta = getCategoryMeta(category);
  if (!meta) return { title: "Forum | Edunancial Community" };
  return {
    title: `${meta.label} Forum | Edunancial Community`,
    description: meta.description,
  };
}

export default async function CategoryForumPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const meta = getCategoryMeta(category);

  if (!meta) {
    notFound();
  }

  const discussions = getDiscussionsByCategory(category);

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
            <li>
              <Link href="/community/forum" className="hover:text-yellow-400 transition-colors">
                Forums
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li className="text-slate-200" aria-current="page">
              {meta.label}
            </li>
          </ol>
        </nav>

        <div className="flex items-start gap-6">
          <div
            className={`h-16 w-16 rounded-xl ${meta.color} flex items-center justify-center text-3xl shrink-0`}
            aria-hidden="true"
          >
            {meta.icon}
          </div>
          <div>
            <p className="uppercase tracking-[0.45em] font-bold text-yellow-400 text-sm">
              FORUM
            </p>
            <h1 className="mt-2 text-4xl font-black md:text-5xl">{meta.label}</h1>
            <p className="mt-3 text-xl text-slate-300 max-w-2xl">
              {meta.description}
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-6 text-sm text-slate-400 border-t border-slate-700 pt-6">
          <span>
            <strong className="text-white">{meta.threadCount.toLocaleString()}</strong> threads
          </span>
          <span>
            <strong className="text-white">{meta.postCount.toLocaleString()}</strong> posts
          </span>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/community/new"
            className="rounded-xl bg-yellow-400 px-8 py-4 font-bold text-black hover:bg-yellow-300 transition-colors"
          >
            Start a Discussion in {meta.label}
          </Link>
        </div>

        <div className="mt-12">
          {discussions.length > 0 ? (
            <div className="space-y-4" role="list" aria-label={`${meta.label} discussions`}>
              {discussions.map((d) => (
                <div key={d.id} role="listitem">
                  <DiscussionCard discussion={d} showCategory={false} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-slate-800 p-12 text-center">
              <p className="text-xl text-slate-400">
                No discussions yet in {meta.label}.
              </p>
              <Link
                href="/community/new"
                className="mt-6 inline-block rounded-xl bg-yellow-400 px-8 py-4 font-bold text-black hover:bg-yellow-300 transition-colors"
              >
                Be the first to post
              </Link>
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-black mb-6">Other Forums</h2>
          <div className="flex flex-wrap gap-3">
            {FORUM_CATEGORIES.filter((c) => c.slug !== category).map((c) => (
              <Link
                key={c.slug}
                href={`/community/forum/${c.slug}`}
                className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:text-yellow-400 hover:bg-slate-700 transition-colors"
              >
                {c.icon} {c.label}
              </Link>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}
