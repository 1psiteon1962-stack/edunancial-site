"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { LibraryItemType, LibraryCategory } from "@/lib/library/libraryTypes";

const TYPES: { value: LibraryItemType | ""; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "book", label: "Books" },
  { value: "audiobook", label: "Audiobooks" },
  { value: "pdf", label: "PDFs" },
  { value: "epub", label: "EPUBs" },
  { value: "video", label: "Videos" },
];

const CATEGORIES: { value: LibraryCategory | ""; label: string }[] = [
  { value: "", label: "All Categories" },
  { value: "foundations", label: "Foundations" },
  { value: "business", label: "Business" },
  { value: "personal-finance", label: "Personal Finance" },
  { value: "real-estate", label: "Real Estate" },
  { value: "investing", label: "Investing" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
  { value: "family-finance", label: "Family Finance" },
  { value: "teen-finance", label: "Teen Finance" },
  { value: "credit-debt", label: "Credit & Debt" },
  { value: "wealth-building", label: "Wealth Building" },
];

const ACCESS_LEVELS = [
  { value: "", label: "All Access Levels" },
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" },
  { value: "membership", label: "Members Only" },
];

export default function LibraryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [accessLevel, setAccessLevel] = useState(searchParams.get("accessLevel") ?? "");

  const apply = useCallback(
    (newType: string, newCategory: string, newAccess: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newType) params.set("type", newType); else params.delete("type");
      if (newCategory) params.set("category", newCategory); else params.delete("category");
      if (newAccess) params.set("accessLevel", newAccess); else params.delete("accessLevel");
      params.delete("page");
      router.push(`/library?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleType = (v: string) => { setType(v); apply(v, category, accessLevel); };
  const handleCategory = (v: string) => { setCategory(v); apply(type, v, accessLevel); };
  const handleAccess = (v: string) => { setAccessLevel(v); apply(type, category, v); };

  return (
    <div className="flex flex-wrap gap-3" role="group" aria-label="Library filters">
      <select
        value={type}
        onChange={(e) => handleType(e.target.value)}
        className="rounded-lg bg-[#101a2f] border border-white/10 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
        aria-label="Filter by content type"
      >
        {TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      <select
        value={category}
        onChange={(e) => handleCategory(e.target.value)}
        className="rounded-lg bg-[#101a2f] border border-white/10 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
        aria-label="Filter by category"
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      <select
        value={accessLevel}
        onChange={(e) => handleAccess(e.target.value)}
        className="rounded-lg bg-[#101a2f] border border-white/10 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
        aria-label="Filter by access level"
      >
        {ACCESS_LEVELS.map((a) => (
          <option key={a.value} value={a.value}>{a.label}</option>
        ))}
      </select>
    </div>
  );
}
