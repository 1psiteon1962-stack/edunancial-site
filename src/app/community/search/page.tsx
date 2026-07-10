import Link from "next/link";
import DiscussionCard from "@/components/community/DiscussionCard";
import { DISCUSSIONS, FORUM_CATEGORIES, CATEGORY_LABELS } from "@/data/community";

export const metadata = {
  title: "Search Discussions | Edunancial Community",
  description:
    "Search the Edunancial community for discussions on budgeting, investing, credit, retirement, and more.",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function SearchDiscussionsPage({
  searchParams,
}: SearchPageProps) {
  const { q, category } = await searchParams;
  const query = q?.trim() ?? "";
  const categoryFilter = category ?? "";

  const results = DISCUSSIONS.filter((d) => {
    const matchesQuery =
      !query ||
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.content.toLowerCase().includes(query.toLowerCase()) ||
      d.tags.some((t) =>
        t.label.toLowerCase().includes(query.toLowerCase())
      ) ||
      d.category.toLowerCase().includes(query.toLowerCase());

    const matchesCategory =
      !categoryFilter || d.category === categoryFilter;

    return matchesQuery && matchesCategory;
  });

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
            <li className="text-slate-200" aria-current="page">Search</li>
          </ol>
        </nav>

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400 text-sm">
          COMMUNITY
        </p>
        <h1 className="mt-4 text-4xl font-black md:text-5xl">
          Search Discussions
        </h1>

        {/* Search form */}
        <form
          method="GET"
          action="/community/search"
          className="mt-8"
          role="search"
          aria-label="Search discussions"
        >
          <div className="flex gap-3 flex-wrap">
            <label htmlFor="search-query" className="sr-only">
              Search query
            </label>
            <input
              id="search-query"
              type="search"
              name="q"
              defaultValue={query}
              className="flex-1 min-w-0 rounded-xl bg-slate-800 border border-slate-600 px-5 py-4 text-white placeholder:text-slate-400 focus:outline-none focus:border-yellow-400 transition-colors"
              placeholder="Search discussions, tags, topics..."
              aria-label="Search query"
            />
            <label htmlFor="search-category" className="sr-only">
              Filter by category
            </label>
            <select
              id="search-category"
              name="category"
              defaultValue={categoryFilter}
              className="rounded-xl bg-slate-800 border border-slate-600 px-4 py-4 text-white focus:outline-none focus:border-yellow-400 transition-colors"
              aria-label="Filter by category"
            >
              <option value="">All categories</option>
              {FORUM_CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-xl bg-yellow-400 px-8 py-4 font-bold text-black hover:bg-yellow-300 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="mt-10">
          {query || categoryFilter ? (
            <>
              <p className="text-slate-400 mb-6" aria-live="polite" aria-atomic="true">
                {results.length > 0 ? (
                  <>
                    Found <strong className="text-white">{results.length}</strong>{" "}
                    discussion{results.length !== 1 ? "s" : ""}
                    {query && (
                      <> for <strong className="text-yellow-400">&ldquo;{query}&rdquo;</strong></>
                    )}
                    {categoryFilter && (
                      <> in <strong className="text-blue-400">{CATEGORY_LABELS[categoryFilter] ?? categoryFilter}</strong></>
                    )}
                  </>
                ) : (
                  <>
                    No discussions found
                    {query && (
                      <> for <strong className="text-yellow-400">&ldquo;{query}&rdquo;</strong></>
                    )}
                    {categoryFilter && (
                      <> in <strong className="text-blue-400">{CATEGORY_LABELS[categoryFilter] ?? categoryFilter}</strong></>
                    )}
                  </>
                )}
              </p>

              {results.length > 0 ? (
                <div className="space-y-4" role="list" aria-label="Search results">
                  {results.map((d) => (
                    <div key={d.id} role="listitem">
                      <DiscussionCard discussion={d} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-slate-800 p-12 text-center">
                  <p className="text-xl text-slate-400 mb-4">
                    No discussions matched your search.
                  </p>
                  <p className="text-slate-500 mb-6">
                    Try different keywords or browse a forum category.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link
                      href="/community/forum"
                      className="rounded-xl bg-slate-700 px-6 py-3 font-bold text-white hover:bg-slate-600 transition-colors"
                    >
                      Browse Forums
                    </Link>
                    <Link
                      href="/community/new"
                      className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black hover:bg-yellow-300 transition-colors"
                    >
                      Start a Discussion
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>
              <h2 className="text-2xl font-black mb-6">Browse by Category</h2>
              <div className="flex flex-wrap gap-3">
                {FORUM_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/community/search?category=${cat.slug}`}
                    className="rounded-full bg-slate-800 px-5 py-2 text-sm text-slate-300 hover:text-yellow-400 hover:bg-slate-700 transition-colors"
                  >
                    {cat.icon} {cat.label}
                  </Link>
                ))}
              </div>

              <h2 className="text-2xl font-black mt-12 mb-6">Popular Searches</h2>
              <div className="flex flex-wrap gap-3">
                {[
                  "debt-free",
                  "index funds",
                  "credit score",
                  "roth ira",
                  "emergency fund",
                  "llc",
                  "real estate",
                  "budget",
                  "scam",
                  "taxes",
                ].map((term) => (
                  <Link
                    key={term}
                    href={`/community/search?q=${encodeURIComponent(term)}`}
                    className="rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:text-yellow-400 hover:border-yellow-400/50 transition-colors"
                  >
                    #{term}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

      </section>
    </main>
  );
}
