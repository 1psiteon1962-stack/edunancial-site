"use client";

import { useState, useEffect } from "react";

interface FavoriteToggleProps {
  itemId: string;
  itemTitle: string;
  userId?: string;
}

export default function FavoriteToggle({
  itemId,
  itemTitle,
  userId = "demo",
}: FavoriteToggleProps) {
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/library/favorites?userId=${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((data) => {
        const found = data.favorites?.some(
          (f: { itemId: string }) => f.itemId === itemId
        );
        setIsFav(Boolean(found));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [itemId, userId]);

  async function toggle() {
    setLoading(true);
    if (isFav) {
      await fetch(
        `/api/library/favorites?userId=${encodeURIComponent(userId)}&itemId=${encodeURIComponent(itemId)}`,
        { method: "DELETE" }
      );
      setIsFav(false);
    } else {
      await fetch(
        `/api/library/favorites?userId=${encodeURIComponent(userId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId }),
        }
      );
      setIsFav(true);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`w-full rounded-lg border px-6 py-3 font-bold transition focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 ${
        isFav
          ? "border-yellow-500 text-yellow-400 hover:border-yellow-300"
          : "border-white/20 text-white hover:border-yellow-500 hover:text-yellow-400"
      }`}
      aria-label={isFav ? `Remove ${itemTitle} from favorites` : `Add ${itemTitle} to favorites`}
      aria-pressed={isFav}
    >
      {isFav ? "★ Saved to Favorites" : "☆ Add to Favorites"}
    </button>
  );
}
