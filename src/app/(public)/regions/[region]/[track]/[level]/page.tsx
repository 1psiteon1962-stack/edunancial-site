import { notFound } from "next/navigation";

import {
  CURRICULUM_LEVELS,
  CURRICULUM_TRACKS,
  getRegionFoundation,
  GLOBAL_REGION_FOUNDATIONS,
  isCurriculumTrack,
  parseCurriculumLevel,
} from "@/lib/global-region-foundation";

export function generateStaticParams() {
  return GLOBAL_REGION_FOUNDATIONS.flatMap((region) =>
    CURRICULUM_TRACKS.flatMap((track) =>
      CURRICULUM_LEVELS.map((level) => ({
        region: region.id,
        track,
        level: `level-${level}`,
      })),
    ),
  );
}

export default async function RegionTrackLevelPage({
  params,
}: {
  params: Promise<{ region: string; track: string; level: string }>;
}) {
  const { region, track, level } = await params;
  const regionFoundation = getRegionFoundation(region);
  const parsedLevel = parseCurriculumLevel(level);

  if (!regionFoundation || !isCurriculumTrack(track) || !parsedLevel) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          {regionFoundation.name}
        </p>

        <h1 className="mt-6 text-5xl font-black uppercase md:text-6xl">
          {track} • Level {parsedLevel}
        </h1>

        <p className="mt-8 text-lg leading-9 text-slate-300">
          Architecture placeholder only. Curriculum is intentionally not loaded
          in this route.
        </p>
      </section>
    </main>
  );
}
