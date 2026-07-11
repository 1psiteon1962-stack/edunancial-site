"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { LibraryItem } from "@/lib/library/libraryTypes";

interface FavoriteWithItem {
  itemId: string;
  addedAt: string;
  item?: LibraryItem;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteWithItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/library/favorites?userId=demo");
      const data = await res.json();
      const favs: FavoriteWithItem[] = data.favorites ?? [];

      // Fetch item details
      const enriched = await Promise.all(
        favs.map(async (fav) => {
          const r = await fetch(`/api/library/items/${fav.itemId}`);
          const item = r.ok ? await r.json() : undefined;
          return { ...fav, item };
        })
      );
      setFavorites(enriched);
      setLoading(false);
    }
    load();
  }, []);

  async function removeFav(itemId: string) {
    await fetch(
      `/api/library/favorites?userId=demo&itemId=${encodeURIComponent(itemId)}`,
      { method: "DELETE" }
    );
    setFavorites((prev) => prev.filter((f) => f.itemId !== itemId));
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-5xl px-6 py-20">

        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-400">
          <Link href="/library" className="hover:text-white">Library</Link>
          <span className="mx-2">›</span>
          <span>My Favorites</span>
        </nav>

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">MY LIBRARY</p>
        <h1 className="mt-4 text-5xl font-black">My Favorites</h1>
        <p className="mt-4 text-slate-400">Items you have saved for quick access.</p>

        {loading ? (
          <div className="mt-16 text-slate-400">Loading…</div>
        ) : favorites.length === 0 ? (
          <div className="mt-16 rounded-2xl bg-slate-900 p-12 text-center">
            <p className="text-2xl font-bold">No favorites yet.</p>
            <p className="mt-4 text-slate-400">
              Browse the{" "}
              <Link href="/library" className="text-blue-400 hover:underline">library</Link>{" "}
              and click <strong>Add to Favorites</strong> on any item.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {favorites.map((fav) => (
              <div
                key={fav.itemId}
                className="flex items-start justify-between gap-6 rounded-xl bg-slate-900 p-6"
              >
                <div className="flex-1">
                  {fav.item ? (
                    <>
                      <p className="text-xs uppercase tracking-widest text-yellow-400 mb-1">
                        {fav.item.type}
                      </p>
                      <Link
                        href={`/library/${fav.itemId}`}
                        className="text-xl font-bold hover:text-blue-400 transition"
                      >
                        {fav.item.title}
                      </Link>
                      <p className="mt-1 text-sm text-slate-400">{fav.item.author}</p>
                    </>
                  ) : (
                    <span className="text-slate-400 text-sm">Item {fav.itemId}</span>
                  )}
                  <p className="mt-2 text-xs text-slate-500">
                    Added {new Date(fav.addedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => removeFav(fav.itemId)}
                  className="shrink-0 rounded-lg border border-white/20 px-4 py-2 text-sm hover:border-red-500 hover:text-red-400 transition focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label={`Remove ${fav.item?.title ?? fav.itemId} from favorites`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
