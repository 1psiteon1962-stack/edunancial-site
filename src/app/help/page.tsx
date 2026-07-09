import Link from "next/link";
import type { Metadata } from "next";
import { helpArticles, helpCategories } from "@/data/help-articles";

export const metadata: Metadata = {
  title: "Help Center",
};

const featuredArticles = [...helpArticles].sort((first, second) => second.views - first.views).slice(0, 6);

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
            Help Center
          </p>
          <h1 className="mt-6 text-5xl font-black md:text-6xl">How Can We Help?</h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Browse support topics, find step-by-step answers, and explore the articles members use
            most.
          </p>
          <div className="mt-10 rounded-xl border border-white/10 bg-[#101a2f] p-6">
            <label htmlFor="help-search" className="mb-3 block text-sm font-bold text-slate-300">
              Search help articles
            </label>
            <input
              id="help-search"
              type="search"
              placeholder="Search for help articles..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {helpCategories.map((category) => (
            <Link
              key={category.id}
              href={`/help/${category.slug}`}
              className="rounded-xl border border-white/10 bg-slate-900 p-8 transition hover:border-blue-500"
            >
              <article className="h-full">
                <div className="text-4xl" aria-hidden="true">
                  {category.icon}
                </div>
                <h2 className="mt-6 text-2xl font-black">{category.name}</h2>
                <p className="mt-4 text-slate-300">{category.description}</p>
                <p className="mt-6 text-sm font-bold text-blue-400">
                  {category.articleCount} article{category.articleCount === 1 ? "" : "s"}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-xl border border-white/10 bg-[#101a2f] p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
                Popular Articles
              </p>
              <h2 className="mt-4 text-4xl font-black">Most-Read Support Guides</h2>
            </div>
            <Link href="/faq" className="font-bold text-blue-400">
              View all FAQs
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {featuredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/help/article/${article.slug}`}
                className="rounded-xl border border-white/10 bg-slate-900 p-6 transition hover:border-blue-500"
              >
                <article>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
                    {article.updatedAt}
                  </p>
                  <h3 className="mt-3 text-2xl font-black">{article.title}</h3>
                  <p className="mt-3 text-slate-300">{article.excerpt}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <aside className="rounded-xl border border-white/10 bg-slate-900 p-8 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
            Support Options
          </p>
          <h2 className="mt-4 text-4xl font-black">Still need help?</h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            If you couldn&apos;t find the answer you need, our team is ready to help with billing,
            technical issues, account questions, and more.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/support/new"
              className="rounded-lg bg-blue-600 px-5 py-3 font-bold hover:bg-blue-500"
            >
              Submit a Ticket
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-white/10 px-5 py-3 font-bold hover:border-blue-500"
            >
              Contact Us
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
