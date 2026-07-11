import Link from "next/link";

const markets = [
  "Japan",
  "South Korea",
  "China",
  "Australia",
  "New Zealand",
  "India",
  "Singapore",
  "Malaysia",
  "Thailand",
  "Indonesia",
  "Vietnam",
  "Philippines",
  "Hong Kong",
  "Taiwan",
  "Bangladesh",
];

const pillars = [
  "Financial curriculum adapted to diverse Asia-Pacific regulatory and economic contexts",
  "Multi-language delivery: EN, ZH, JA, KO, HI, ID, VI",
  "Red, White, and Blue levels 1–5 curriculum-ready foundation",
  "Localized pricing and membership for Asia-Pacific market structures",
];

export const metadata = {
  title: "Edunancial Asia-Pacific | Financial Competency Platform",
  description:
    "Edunancial Asia-Pacific delivers financial competency education across East Asia, Southeast Asia, South Asia, and Oceania with a complete curriculum-ready architectural foundation.",
};

export default function AsiaPacificPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          Asia-Pacific Regional Architecture
        </p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Building financial competency across Asia-Pacific.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Edunancial Asia-Pacific serves the world's most economically diverse regional block — spanning East Asia, Southeast Asia, South Asia, and Oceania — with financial education infrastructure ready to receive Red, White, and Blue curriculum at all five levels.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/membership" className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700">
            Become a Member
          </Link>
          <Link href="/assessment" className="rounded-xl border border-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-slate-950">
            Start Assessment
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
