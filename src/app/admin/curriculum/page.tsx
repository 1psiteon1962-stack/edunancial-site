import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { requireAdminPageSession } from "@/lib/admin-content/auth";
import { getCurriculumSearchIndex, listTracks } from "@/lib/curriculum/reader";
import { readTierConfig } from "@/lib/curriculum/tier-config";
import CurriculumDashboardClient from "./CurriculumDashboardClient";

export const metadata: Metadata = {
  title: "Curriculum Dashboard | Edunancial Admin",
  robots: { index: false, follow: false },
};

// Derive the effective visibility for a lesson based on its level and lesson number
function deriveVisibility(level: number, lessonNumber: number, tierConfig: ReturnType<typeof readTierConfig>): string {
  const fp = tierConfig.freePreview;
  if (level === fp.level && lessonNumber <= fp.maxLesson) return "free_preview";
  return "members_only";
}

// Derive which tiers unlock a lesson
function deriveUnlockedByTiers(level: number, lessonNumber: number, tierConfig: ReturnType<typeof readTierConfig>): string[] {
  const fp = tierConfig.freePreview;
  if (level === fp.level && lessonNumber <= fp.maxLesson) return []; // free preview — no tier needed
  const result: string[] = [];
  const tierOrder = ["basic", "pro", "gold"] as const;
  for (const tier of tierOrder) {
    if ((tierConfig.mapping[tier] ?? []).includes(level)) {
      result.push(tier);
    }
  }
  return result;
}

export default async function CurriculumDashboardPage() {
  await requireAdminPageSession();

  const tracks = listTracks("admin");
  const searchIndex = getCurriculumSearchIndex();
  const tierConfig = readTierConfig();
  const cookieStore = await cookies();
  const csrfToken = cookieStore.get("edunancial_admin_csrf")?.value ?? "";

  const rows = searchIndex.map((entry) => {
    const trackData = tracks.find((t) => t.code === entry.track);
    const levelData = trackData?.levels.find((l) => l.level === entry.level);
    const meta = levelData?.lessons.find((l) => l.id === entry.id);

    const visibility = deriveVisibility(entry.level, entry.lessonNumber, tierConfig);
    const unlockedByTiers = deriveUnlockedByTiers(entry.level, entry.lessonNumber, tierConfig);

    return {
      id: entry.id,
      track: entry.track,
      trackName: entry.trackName,
      level: entry.level,
      lessonNumber: entry.lessonNumber,
      title: entry.title,
      summary: entry.summary,
      status: meta?.status ?? "unknown",
      visibility,
      importedAt: meta?.importedAt ?? "",
      hasContent: true,
      warnings: meta ? [] : ["Not found in registry"],
      unlockedByTiers,
      contentUrl: entry.url,
      editUrl: `/admin/curriculum/lessons/${entry.id}`,
    };
  });

  const trackCodes = Array.from(new Set(rows.map((r) => r.track))).sort();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-yellow-400 mb-1">Admin</p>
            <h1 className="text-4xl font-black">Curriculum Dashboard</h1>
            <p className="mt-2 text-slate-400">
              Single reference point for all curriculum content — visibility, access tiers, and
              management actions.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/curriculum"
              className="rounded-xl border border-blue-500/40 px-5 py-3 text-sm font-semibold text-blue-300 hover:border-blue-400 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              View as Member ↗
            </Link>
            <Link
              href="/admin/uploads"
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:border-slate-500 transition"
            >
              Upload Portal
            </Link>
          </div>
        </div>

        <CurriculumDashboardClient
          rows={rows}
          tracks={trackCodes}
          csrfToken={csrfToken}
          totalLessons={rows.length}
          totalTracks={trackCodes.length}
        />

        {/* Registry info */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
          <h3 className="font-black text-slate-400 mb-2">Content Management</h3>
          <div className="grid gap-4 sm:grid-cols-2 text-sm text-slate-400">
            <div>
              <p className="font-semibold text-slate-300 mb-1">Add a single lesson</p>
              <p>Use the &ldquo;+ Add Lesson&rdquo; button above, or run:</p>
              <code className="block mt-1 bg-slate-800 text-yellow-300 px-3 py-1.5 rounded text-xs font-mono">
                npm run curriculum:import -- /path/to/lesson.md
              </code>
            </div>
            <div>
              <p className="font-semibold text-slate-300 mb-1">Tier access configuration</p>
              <p>
                Which levels each tier unlocks is configured in{" "}
                <Link href="/admin/curriculum/tier-config" className="text-yellow-400 hover:text-yellow-300 underline">
                  Tier → Level Configuration
                </Link>
                . Changes take effect immediately.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
