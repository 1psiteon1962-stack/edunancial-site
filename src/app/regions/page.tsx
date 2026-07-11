import Link from "next/link";

import { GLOBAL_REGION_FOUNDATIONS } from "@/lib/global-region-foundation";

export const metadata = {
  title: "Global Regional Architecture | Edunancial",
  description:
    "Site-wide regional architecture foundation for future curriculum loading.",
};

export default function RegionsArchitecturePage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          Global Architecture
        </p>

        <h1 className="mt-6 text-5xl font-black md:text-6xl">
          Regional Foundations
        </h1>

        <p className="mt-6 max-w-4xl text-lg text-slate-300">
          Structural routing placeholders for all global regions. RED, WHITE,
          and BLUE tracks are scaffolded for Levels 1 through 5 without loading
          curriculum content.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {GLOBAL_REGION_FOUNDATIONS.map((region) => (
            <Link
              key={region.id}
              href={region.path}
              className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"
            >
              <h2 className="text-2xl font-black">{region.name}</h2>
              <p className="mt-3 text-slate-300">{region.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
