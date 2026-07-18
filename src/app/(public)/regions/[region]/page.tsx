import Link from "next/link";
import { notFound } from "next/navigation";

import {
  CURRICULUM_LEVELS,
  CURRICULUM_TRACKS,
  getRegionFoundation,
  GLOBAL_REGION_FOUNDATIONS,
} from "@/lib/global-region-foundation";

export function generateStaticParams() {
  return GLOBAL_REGION_FOUNDATIONS.map((region) => ({
    region: region.id,
  }));
}

export default async function RegionArchitecturePage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const regionFoundation = getRegionFoundation(region);

  if (!regionFoundation) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          {regionFoundation.name}
        </p>

        <h1 className="mt-6 text-5xl font-black md:text-6xl">
          Curriculum Architecture Scaffold
        </h1>

        <p className="mt-6 max-w-4xl text-lg text-slate-300">
          Future curriculum can be attached per track and level. This page only
          provides architecture placeholders and intentionally contains no
          lesson content.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {CURRICULUM_TRACKS.map((track) => (
            <section
              key={track}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-2xl font-black uppercase">{track}</h2>
              <ul className="mt-4 space-y-2">
                {CURRICULUM_LEVELS.map((level) => (
                  <li key={level}>
                    <Link
                      href={`/regions/${regionFoundation.id}/${track}/level-${level}`}
                      className="text-blue-300 hover:text-blue-200"
                    >
                      Level {level} placeholder
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
