"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LibrarySearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    params.delete("page");
    router.push(`/library?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-2xl" role="search">
      <label htmlFor="library-search" className="sr-only">
        Search the library
      </label>
      <input
        id="library-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search books, audiobooks, videos…"
        className="flex-1 rounded-lg bg-[#101a2f] border border-white/10 px-5 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-6 py-3 font-bold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Search
      </button>
    </form>
  );
}
