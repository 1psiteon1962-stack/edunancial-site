"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { MediaItem } from "@/lib/admin-content/types";

const TYPE_ICONS: Record<string, string> = {
  "image/png": "🖼️",
  "image/jpeg": "🖼️",
  "image/webp": "🖼️",
  "application/pdf": "📄",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "📝",
  "video/mp4": "🎬",
  "audio/mpeg": "🎵",
  "application/zip": "📦",
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function MediaLibraryClient() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/media", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        setMedia(data.media ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? media : media.filter((item) => item.mimeType.startsWith(filter));

  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Admin</p>
            <h1 className="mt-2 text-4xl font-black">Media Library</h1>
            <p className="mt-2 text-slate-400">
              {media.length} item{media.length !== 1 ? "s" : ""} uploaded
            </p>
          </div>
          <Link
            href="/admin/content/upload"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
          >
            Upload Files
          </Link>
        </div>

        <div className="mt-8 flex gap-2">
          {[
            ["all", "All"],
            ["image", "Images"],
            ["application/pdf", "PDFs"],
            ["video", "Videos"],
            ["audio", "Audio"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium ${
                filter === value
                  ? "bg-blue-600 text-white"
                  : "border border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-16 text-center text-slate-500">Loading media…</div>
        ) : filtered.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-white/10 bg-[#101a2f] p-12 text-center">
            <p className="text-2xl font-bold">No media yet</p>
            <p className="mt-3 text-slate-400">
              Upload files via the Content Upload Portal. Approved files appear here.
            </p>
            <Link
              href="/admin/content/upload"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
            >
              Go to Upload Portal
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-[#101a2f] p-4 hover:border-white/20"
              >
                <div className="flex h-24 items-center justify-center rounded-xl bg-[#0a1020] text-4xl">
                  {TYPE_ICONS[item.mimeType] ?? "📎"}
                </div>
                <p className="mt-3 truncate text-sm font-semibold text-white">
                  {item.title || item.id}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.extension.toUpperCase()} · {formatBytes(item.sizeBytes)}
                </p>
                <p className="text-xs text-slate-600">
                  {new Date(item.uploadedAt).toLocaleDateString()}
                </p>
                {item.associatedCourseIds.length > 0 && (
                  <p className="mt-1 text-xs text-blue-400">
                    Used in {item.associatedCourseIds.length} course
                    {item.associatedCourseIds.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="mt-8 text-xs text-slate-600">
          Note: Media is managed through the{" "}
          <Link href="/admin/content" className="text-blue-400 hover:underline">
            Content Upload Portal
          </Link>
          . Use the portal to upload and approve files. Approved media appears here for
          reference.
        </p>
      </div>
    </main>
  );
}
