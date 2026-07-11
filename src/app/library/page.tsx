import { Suspense } from "react";
import Link from "next/link";
import { searchLibraryItems } from "@/lib/library/libraryData";
import LibraryCard from "@/components/library/LibraryCard";
import LibrarySearch from "@/components/library/LibrarySearch";
import LibraryFilters from "@/components/library/LibraryFilters";
import type { LibraryItemType, LibraryCategory, AccessLevel } from "@/lib/library/libraryTypes";

export const metadata = {
  title: "Digital Library | Edunancial",
  description:
    "Explore books, audiobooks, PDFs, EPUBs, and video courses on personal finance, business, and wealth building.",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    category?: string;
    accessLevel?: string;
    page?: string;
  }>;
}

const NAV_LINKS = [
  { href: "/library/favorites", label: "My Favorites" },
  { href: "/library/bookmarks", label: "My Bookmarks" },
  { href: "/library/progress", label: "My Progress" },
  { href: "/library/downloads", label: "My Downloads" },
];

export default async function LibraryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q ?? "";
  const type = (params.type ?? "") as LibraryItemType | "";
  const category = (params.category ?? "") as LibraryCategory | "";
  const accessLevel = (params.accessLevel ?? "") as AccessLevel | "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const perPage = 12;

  const { items, total } = searchLibraryItems({ q, type, category, accessLevel, page, perPage });
  const totalPages = Math.ceil(total / perPage);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
              DIGITAL LIBRARY
            </p>
            <h1 className="mt-4 text-5xl font-black md:text-6xl">
              Knowledge on Demand
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-slate-300 leading-8">
              Books, audiobooks, PDFs, EPUBs, and video courses — everything you
              need to build financial competency.
            </p>
          </div>

          {/* Personal library nav */}
          <nav aria-label="My library" className="flex flex-wrap gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold hover:border-blue-500 hover:text-blue-400 transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Search & filters */}
        <div className="mt-12 flex flex-wrap gap-4">
          <Suspense>
            <LibrarySearch />
          </Suspense>
        </div>
        <div className="mt-4">
          <Suspense>
            <LibraryFilters />
          </Suspense>
        </div>

        {/* Active filters summary */}
        {(q || type || category || accessLevel) && (
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-slate-400">Filtered:</span>
            {q && <span className="rounded bg-slate-800 px-3 py-1">Search: {q}</span>}
            {type && <span className="rounded bg-slate-800 px-3 py-1">Type: {type}</span>}
            {category && <span className="rounded bg-slate-800 px-3 py-1">Category: {category}</span>}
            {accessLevel && <span className="rounded bg-slate-800 px-3 py-1">Access: {accessLevel}</span>}
            <Link href="/library" className="text-blue-400 hover:underline">Clear all</Link>
          </div>
        )}

        {/* Results count */}
        <p className="mt-8 text-slate-400 text-sm">
          {total === 0
            ? "No items found"
            : `Showing ${(page - 1) * perPage + 1}–${Math.min(page * perPage, total)} of ${total} item${total !== 1 ? "s" : ""}`}
        </p>

        {/* Grid */}
        {items.length === 0 ? (
          <div className="mt-16 rounded-2xl bg-slate-900 p-12 text-center">
            <p className="text-2xl font-bold">No items match your search.</p>
            <p className="mt-4 text-slate-400">
              Try adjusting your filters or{" "}
              <Link href="/library" className="text-blue-400 hover:underline">browse everything</Link>.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <LibraryCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Library pagination"
            className="mt-12 flex items-center justify-center gap-2"
          >
            {page > 1 && (
              <Link
                href={`/library?${buildPageParams(params, page - 1)}`}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:border-blue-500"
              >
                ← Previous
              </Link>
            )}
            <span className="text-slate-400 text-sm px-4">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/library?${buildPageParams(params, page + 1)}`}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:border-blue-500"
              >
                Next →
              </Link>
            )}
          </nav>
        )}
      </section>
    </main>
  );
}

function buildPageParams(
  current: Record<string, string | undefined>,
  newPage: number
): string {
  const p = new URLSearchParams();
  if (current.q) p.set("q", current.q);
  if (current.type) p.set("type", current.type);
  if (current.category) p.set("category", current.category);
  if (current.accessLevel) p.set("accessLevel", current.accessLevel);
  p.set("page", String(newPage));
  return p.toString();
}
