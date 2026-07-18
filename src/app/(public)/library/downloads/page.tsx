"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { DownloadEvent } from "@/lib/library/libraryTypes";

interface DownloadWithTitle extends DownloadEvent {
  itemTitle?: string;
}

export default function LibraryDownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadWithTitle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/library/downloads?userId=demo");
      const data = await res.json();
      const evts: DownloadEvent[] = data.downloads ?? [];

      const enriched = await Promise.all(
        evts.map(async (ev) => {
          const r = await fetch(`/api/library/items/${ev.itemId}`);
          const item = r.ok ? await r.json() : undefined;
          return { ...ev, itemTitle: item?.title };
        })
      );
      setDownloads(enriched.reverse()); // most recent first
      setLoading(false);
    }
    load();
  }, []);

  function formatSize(bytes?: number): string {
    if (!bytes) return "—";
    if (bytes < 1_000_000) return `${(bytes / 1_000).toFixed(0)} KB`;
    return `${(bytes / 1_000_000).toFixed(1)} MB`;
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-5xl px-6 py-20">

        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-400">
          <Link href="/library" className="hover:text-white">Library</Link>
          <span className="mx-2">›</span>
          <span>My Downloads</span>
        </nav>

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">MY LIBRARY</p>
        <h1 className="mt-4 text-5xl font-black">My Downloads</h1>
        <p className="mt-4 text-slate-400">
          All your download history — books, PDFs, audiobooks, and EPUBs.
        </p>

        {loading ? (
          <div className="mt-16 text-slate-400">Loading…</div>
        ) : downloads.length === 0 ? (
          <div className="mt-16 rounded-2xl bg-slate-900 p-12 text-center">
            <p className="text-2xl font-bold">No downloads yet.</p>
            <p className="mt-4 text-slate-400">
              Browse the{" "}
              <Link href="/library" className="text-blue-400 hover:underline">library</Link>{" "}
              and download any eligible item.
            </p>
          </div>
        ) : (
          <div className="mt-10 overflow-x-auto">
            <table className="w-full text-sm" aria-label="Download history">
              <thead>
                <tr className="border-b border-white/10 text-left text-slate-400">
                  <th className="pb-3 font-semibold">Item</th>
                  <th className="pb-3 font-semibold">Format</th>
                  <th className="pb-3 font-semibold">Size</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {downloads.map((dl) => (
                  <tr key={dl.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 pr-4">
                      <Link
                        href={`/library/${dl.itemId}`}
                        className="font-semibold hover:text-blue-400 transition"
                      >
                        {dl.itemTitle ?? dl.itemId}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 uppercase text-slate-300">{dl.fileFormat}</td>
                    <td className="py-4 pr-4 text-slate-300">{formatSize(dl.fileSizeBytes)}</td>
                    <td className="py-4 text-slate-400">
                      {new Date(dl.downloadedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
