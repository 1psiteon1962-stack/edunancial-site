import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getTrack, listTracks } from "@/lib/curriculum/reader";

interface Props {
  params: Promise<{ track: string }>;
}

export async function generateStaticParams() {
  const tracks = listTracks();
  return tracks.map((t) => ({ track: t.code.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track: trackParam } = await params;
  const track = getTrack(trackParam.toUpperCase());
  if (!track) return { title: "Track Not Found | Edunancial" };

  const totalLessons = track.levels.reduce((sum, l) => sum + l.lessonCount, 0);
  const title = `${track.name} (${track.code}) | Edunancial`;
  const description = `${track.name} curriculum — ${totalLessons} lesson${totalLessons !== 1 ? "s" : ""} available.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", siteName: "Edunancial" },
  };
}

const TRACK_COLORS: Record<string, { badge: string; heading: string; border: string }> = {
  RED: { badge: "text-red-400 border-red-500/40 bg-red-500/10", heading: "text-red-400", border: "border-red-500/30 hover:border-red-400/60" },
  WHITE: { badge: "text-slate-300 border-slate-500/40 bg-slate-500/10", heading: "text-slate-200", border: "border-slate-500/30 hover:border-slate-400/60" },
  BLUE: { badge: "text-blue-400 border-blue-500/40 bg-blue-500/10", heading: "text-blue-400", border: "border-blue-500/30 hover:border-blue-400/60" },
  GREEN: { badge: "text-green-400 border-green-500/40 bg-green-500/10", heading: "text-green-400", border: "border-green-500/30 hover:border-green-400/60" },
  GOLD: { badge: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10", heading: "text-yellow-400", border: "border-yellow-500/30 hover:border-yellow-400/60" },
  PURPLE: { badge: "text-purple-400 border-purple-500/40 bg-purple-500/10", heading: "text-purple-400", border: "border-purple-500/30 hover:border-purple-400/60" },
  ORANGE: { badge: "text-orange-400 border-orange-500/40 bg-orange-500/10", heading: "text-orange-400", border: "border-orange-500/30 hover:border-orange-400/60" },
  BLACK: { badge: "text-slate-200 border-slate-400/40 bg-slate-400/10", heading: "text-slate-200", border: "border-slate-400/30 hover:border-slate-300/60" },
};

const DEFAULT_COLORS = {
  badge: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
  heading: "text-yellow-400",
  border: "border-yellow-500/30 hover:border-yellow-400/60",
};

export default async function TrackPage({ params }: Props) {
  const { track: trackParam } = await params;
  const trackCode = trackParam.toUpperCase();
  const track = getTrack(trackCode);
  if (!track) notFound();

  const colors = TRACK_COLORS[trackCode] ?? DEFAULT_COLORS;
  const totalLessons = track.levels.reduce((sum, l) => sum + l.lessonCount, 0);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link href="/curriculum" className="hover:text-white">Curriculum</Link>
          <span>/</span>
          <span className="text-slate-200">{track.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold border mb-4 ${colors.badge}`}>
            {track.code} Track
          </span>
          <h1 className={`text-5xl font-black md:text-6xl ${colors.heading}`}>
            {track.name}
          </h1>
          <p className="mt-4 text-slate-300 text-lg">
            {totalLessons > 0
              ? `${totalLessons} lesson${totalLessons !== 1 ? "s" : ""} across ${track.levels.length} level${track.levels.length !== 1 ? "s" : ""}`
              : "Curriculum coming soon."}
          </p>
        </div>

        {/* Levels */}
        {track.levels.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {track.levels.map((level) => (
              <Link
                key={level.level}
                href={`/curriculum/${trackParam}/l${level.level}`}
                className={`rounded-2xl bg-slate-900 border p-6 transition group ${colors.border}`}
              >
                <p className="text-sm text-slate-500 mb-1">Level {level.level}</p>
                <h3 className="text-xl font-black text-white group-hover:text-yellow-400 transition">
                  {track.name} {level.level}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  {level.lessonCount > 0
                    ? `${level.lessonCount} lesson${level.lessonCount !== 1 ? "s" : ""}`
                    : "Coming soon"}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
            <p className="text-2xl font-bold text-slate-400">Coming Soon</p>
            <p className="mt-3 text-slate-500">
              {track.name} curriculum is being prepared.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
