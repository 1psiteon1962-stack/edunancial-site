import Link from "next/link";
import type { LibraryItem } from "@/lib/library/libraryTypes";

const TYPE_LABELS: Record<string, string> = {
  book: "Book",
  audiobook: "Audiobook",
  pdf: "PDF",
  epub: "EPUB",
  video: "Video",
};

const TYPE_COLORS: Record<string, string> = {
  book: "border-blue-600",
  audiobook: "border-purple-600",
  pdf: "border-red-500",
  epub: "border-green-500",
  video: "border-yellow-500",
};

const ACCESS_BADGE: Record<string, string> = {
  free: "bg-green-700 text-green-100",
  paid: "bg-blue-700 text-blue-100",
  membership: "bg-yellow-700 text-yellow-100",
};

function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1_000_000) return `${(bytes / 1_000).toFixed(0)} KB`;
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

function formatDuration(mins?: number): string {
  if (!mins) return "";
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export default function LibraryCard({ item }: { item: LibraryItem }) {
  const borderColor = TYPE_COLORS[item.type] ?? "border-slate-600";
  const accessBadge = ACCESS_BADGE[item.accessLevel] ?? "bg-slate-700";

  return (
    <Link
      href={`/library/${item.id}`}
      className={`group block rounded-xl border-l-4 ${borderColor} bg-slate-900 p-6 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400`}
      aria-label={`${item.title} — ${TYPE_LABELS[item.type]}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
              {TYPE_LABELS[item.type]}
            </span>
            <span className={`rounded px-2 py-0.5 text-xs font-semibold ${accessBadge}`}>
              {item.accessLevel === "free" ? "Free" : item.accessLevel === "membership" ? "Members" : `$${item.price?.toFixed(2)}`}
            </span>
            {item.downloadable && (
              <span className="rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-300">
                ↓ {item.fileFormat?.toUpperCase()}
              </span>
            )}
          </div>

          <h2 className="text-xl font-black leading-tight group-hover:text-blue-400 transition">
            {item.title}
          </h2>
          <p className="mt-1 text-sm text-slate-400">{item.author}</p>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm text-slate-300 line-clamp-2 leading-relaxed">
        {item.description}
      </p>

      {/* Footer */}
      <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
        {item.pageCount && <span>{item.pageCount} pages</span>}
        {item.durationMinutes && <span>{formatDuration(item.durationMinutes)}</span>}
        {item.fileSizeBytes && <span>{formatFileSize(item.fileSizeBytes)}</span>}
        {item.averageRating && (
          <span className="text-yellow-400">
            ★ {item.averageRating.toFixed(1)} ({item.ratingCount?.toLocaleString()})
          </span>
        )}
        <span className="ml-auto">{item.viewCount.toLocaleString()} views</span>
      </div>
    </Link>
  );
}
