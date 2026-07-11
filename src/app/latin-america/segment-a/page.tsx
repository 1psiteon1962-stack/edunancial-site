import Link from "next/link";

const markets = [
  "Mexico",
  "Guatemala",
  "Honduras",
  "El Salvador",
  "Nicaragua",
  "Costa Rica",
  "Panama",
  "Belize",
];

const pillars = [
  "Financial curriculum adapted to Spanish-speaking Central American markets",
  "Multi-language delivery: ES, EN, indigenous language support",
  "Red, White, and Blue levels 1–5 curriculum-ready foundation",
  "Localized pricing and membership structures for Mexico and Central American economies",
];

export const metadata = {
  title: "Edunancial Latin America — Segment A: Mexico & Central America",
  description:
    "Edunancial Latin America Segment A serves Mexico and Central America with a complete curriculum-ready architectural foundation for financial competency education.",
};

export default function LatinAmericaSegmentAPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          Latin America — Segment A
        </p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Mexico &amp; Central America: financial competency foundation.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Latin America Segment A is the Mexico and Central American architectural module of Edunancial, delivering Spanish-first financial education infrastructure across Mexico and the seven Central American nations, ready to receive Red, White, and Blue curriculum at all five levels.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/membership" className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700">
            Become a Member
          </Link>
          <Link href="/latin-america" className="rounded-xl border border-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-slate-950">
            ← Back to Latin America
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
        <div className="grid gap-3 md:grid-cols-4">
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
