import { notFound } from "next/navigation";
import Link from "next/link";
import { getLibraryItem } from "@/lib/library/libraryData";
import DownloadButton from "@/components/library/DownloadButton";
import FavoriteToggle from "@/components/library/FavoriteToggle";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const item = getLibraryItem(id);
  if (!item) return {};
  return {
    title: `${item.title} | Edunancial Library`,
    description: item.description,
  };
}

const TYPE_LABELS: Record<string, string> = {
  book: "Book",
  audiobook: "Audiobook",
  pdf: "PDF",
  epub: "EPUB",
  video: "Video",
};

const ACCESS_LABELS: Record<string, string> = {
  free: "Free",
  paid: "Paid",
  membership: "Members Only",
};

function formatDuration(mins?: number): string {
  if (!mins) return "";
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1_000_000) return `${(bytes / 1_000).toFixed(0)} KB`;
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

export default async function LibraryItemPage({ params }: PageProps) {
  const { id } = await params;
  const item = getLibraryItem(id);
  if (!item) notFound();

  const isPaidOrMembership = item.accessLevel !== "free";

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-5xl px-6 py-20">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-400">
          <Link href="/library" className="hover:text-white">Library</Link>
          <span className="mx-2">›</span>
          <span>{item.title}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-3">

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Cover placeholder */}
            <div className="w-full aspect-[3/4] rounded-xl bg-slate-800 flex items-center justify-center text-slate-500">
              <span className="text-5xl" aria-hidden="true">
                {item.type === "video" ? "▶" : item.type === "audiobook" ? "🎧" : "📄"}
              </span>
            </div>

            {/* Action buttons */}
            <div className="mt-6 space-y-3">
              {item.accessLevel === "free" || !isPaidOrMembership ? (
                <>
                  {item.previewUrl && (
                    <Link
                      href={item.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-bold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {item.type === "video" ? "Watch Now" : "Read / Listen"}
                    </Link>
                  )}
                  <DownloadButton item={item} />
                </>
              ) : (
                <>
                  {item.previewUrl && (
                    <Link
                      href={item.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full rounded-lg border border-white/20 px-6 py-3 text-center font-bold hover:border-blue-500 hover:text-blue-400 transition"
                    >
                      Free Preview
                    </Link>
                  )}
                  <Link
                    href={`/checkout?item=${item.id}`}
                    className="block w-full rounded-lg bg-yellow-500 px-6 py-3 text-center font-bold text-black hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    {item.accessLevel === "membership"
                      ? "Join to Access"
                      : `Buy — $${item.price?.toFixed(2)}`}
                  </Link>
                </>
              )}

              <FavoriteToggle itemId={item.id} itemTitle={item.title} />
            </div>

            {/* Item metadata */}
            <dl className="mt-8 space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-slate-400">Type</dt>
                <dd className="font-semibold">{TYPE_LABELS[item.type]}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-slate-400">Access</dt>
                <dd className="font-semibold">{ACCESS_LABELS[item.accessLevel]}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-slate-400">Language</dt>
                <dd className="font-semibold uppercase">{item.language}</dd>
              </div>
              {item.pageCount && (
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <dt className="text-slate-400">Pages</dt>
                  <dd className="font-semibold">{item.pageCount}</dd>
                </div>
              )}
              {item.durationMinutes && (
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <dt className="text-slate-400">Duration</dt>
                  <dd className="font-semibold">{formatDuration(item.durationMinutes)}</dd>
                </div>
              )}
              {item.fileSizeBytes && (
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <dt className="text-slate-400">File Size</dt>
                  <dd className="font-semibold">{formatFileSize(item.fileSizeBytes)}</dd>
                </div>
              )}
              {item.fileFormat && (
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <dt className="text-slate-400">Format</dt>
                  <dd className="font-semibold uppercase">{item.fileFormat}</dd>
                </div>
              )}
              {item.narrator && (
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <dt className="text-slate-400">Narrator</dt>
                  <dd className="font-semibold">{item.narrator}</dd>
                </div>
              )}
              {item.averageRating && (
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <dt className="text-slate-400">Rating</dt>
                  <dd className="font-semibold text-yellow-400">
                    ★ {item.averageRating.toFixed(1)}
                    <span className="text-slate-400 font-normal"> ({item.ratingCount?.toLocaleString()})</span>
                  </dd>
                </div>
              )}
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-slate-400">Downloads</dt>
                <dd className="font-semibold">{item.downloadCount.toLocaleString()}</dd>
              </div>
            </dl>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Type badge */}
            <p className="uppercase tracking-[0.45em] text-sm font-bold text-yellow-400">
              {TYPE_LABELS[item.type]}
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              {item.title}
            </h1>

            <p className="mt-3 text-slate-400">
              By <span className="text-white font-semibold">{item.author}</span>
              {item.publisher && ` • ${item.publisher}`}
            </p>

            {/* Categories */}
            <div className="mt-6 flex flex-wrap gap-2">
              {item.categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/library?category=${cat}`}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs capitalize hover:border-blue-500 hover:text-blue-400 transition"
                >
                  {cat.replace("-", " ")}
                </Link>
              ))}
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">About This Item</h2>
              <p className="text-slate-300 leading-8">
                {item.longDescription ?? item.description}
              </p>
            </div>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-bold text-slate-400 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/library?q=${encodeURIComponent(tag)}`}
                      className="rounded bg-slate-800 px-3 py-1 text-xs text-slate-300 hover:bg-slate-700 transition"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Video preview */}
            {item.type === "video" && item.previewUrl && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold mb-6">Preview</h2>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                  <iframe
                    src={item.previewUrl}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Back to library */}
            <div className="mt-12">
              <Link
                href="/library"
                className="text-blue-400 hover:underline text-sm"
              >
                ← Back to Library
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
