import Link from "next/link";

const markets = [
  "United Kingdom",
  "France",
  "Germany",
  "Spain",
  "Italy",
  "Netherlands",
  "Belgium",
  "Sweden",
  "Switzerland",
  "Austria",
  "Denmark",
  "Norway",
  "Finland",
  "Ireland",
  "Luxembourg",
];

const pillars = [
  "Regulatory-aware financial curriculum aligned to EU frameworks",
  "Multi-language delivery: EN, FR, DE, ES, IT",
  "Red, White, and Blue levels 1–5 curriculum-ready foundation",
  "Localized pricing and membership structures for Western European markets",
];

export const metadata = {
  title: "Edunancial Europe 2A — Western Europe",
  description:
    "Edunancial Europe 2A covers the Western European architecture: UK, France, Germany, Spain, Italy, and allied markets, providing a complete curriculum-ready foundation.",
};

export default function Europe2APage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          Europe 2A — Western Europe
        </p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Building financial competency across Western Europe.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Europe 2A is the Western European architectural segment of Edunancial, serving established EU economies and the UK with regulatory-aware, multilingual financial education infrastructure ready to receive Red, White, and Blue curriculum at all five levels.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/membership" className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700">
            Become a Member
          </Link>
          <Link href="/europe" className="rounded-xl border border-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-slate-950">
            ← Back to Europe
          </Link>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-950/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-16 md:grid-cols-4">
          {pillars.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-lg font-bold leading-8">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="mb-6 text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          Markets Covered
        </p>
        <div className="grid gap-3 md:grid-cols-5">
          {markets.map((market) => (
            <div
              key={market}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
            >
              {market}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
