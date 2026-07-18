"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { UserBookmark } from "@/lib/library/libraryTypes";

interface BookmarkWithTitle extends UserBookmark {
  itemTitle?: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkWithTitle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/library/bookmarks?userId=demo");
      const data = await res.json();
      const bms: UserBookmark[] = data.bookmarks ?? [];

      const enriched = await Promise.all(
        bms.map(async (bm) => {
          const r = await fetch(`/api/library/items/${bm.itemId}`);
          const item = r.ok ? await r.json() : undefined;
          return { ...bm, itemTitle: item?.title };
        })
      );
      setBookmarks(enriched);
      setLoading(false);
    }
    load();
  }, []);

  async function deleteBookmark(bookmarkId: string) {
    await fetch(
      `/api/library/bookmarks?userId=demo&bookmarkId=${encodeURIComponent(bookmarkId)}`,
      { method: "DELETE" }
    );
    setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-5xl px-6 py-20">

        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-400">
          <Link href="/library" className="hover:text-white">Library</Link>
          <span className="mx-2">›</span>
          <span>My Bookmarks</span>
        </nav>

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">MY LIBRARY</p>
        <h1 className="mt-4 text-5xl font-black">My Bookmarks</h1>
        <p className="mt-4 text-slate-400">
          Saved positions in books, audiobooks, and videos.
        </p>

        {loading ? (
          <div className="mt-16 text-slate-400">Loading…</div>
        ) : bookmarks.length === 0 ? (
          <div className="mt-16 rounded-2xl bg-slate-900 p-12 text-center">
            <p className="text-2xl font-bold">No bookmarks yet.</p>
            <p className="mt-4 text-slate-400">
              Open any{" "}
              <Link href="/library" className="text-blue-400 hover:underline">library item</Link>{" "}
              and save your reading position.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="flex items-start justify-between gap-6 rounded-xl bg-slate-900 p-6"
              >
                <div className="flex-1">
                  <Link
                    href={`/library/${bm.itemId}`}
                    className="text-lg font-bold hover:text-blue-400 transition"
                  >
                    {bm.itemTitle ?? bm.itemId}
                  </Link>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-400">
                    <span>
                      Position:{" "}
                      <span className="text-white font-semibold capitalize">
                        {bm.positionType} {bm.position}
                      </span>
                    </span>
                    {bm.note && (
                      <span>
                        Note: <span className="text-slate-300 italic">{bm.note}</span>
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Saved {new Date(bm.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteBookmark(bm.id)}
                  className="shrink-0 rounded-lg border border-white/20 px-4 py-2 text-sm hover:border-red-500 hover:text-red-400 transition focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label={`Delete bookmark for ${bm.itemTitle ?? bm.itemId}`}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
