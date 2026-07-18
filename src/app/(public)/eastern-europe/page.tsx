import Link from "next/link";

const launchPriorities = [
  "Emerging financial systems across Eastern and Central Europe",
  "Business formation in high-growth transition economies",
  "Investment markets and regional capital access",
  "Currency dynamics and cross-border expansion strategies",
];

export const metadata = {
  title: "Edunancial Eastern Europe | Financial Competency Platform",
  description:
    "Edunancial Eastern Europe helps members in Poland, Romania, Czech Republic, Hungary, and neighboring countries build financial competency through structured education.",
};

export default function EasternEuropePage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          Europe — Eastern Segment
        </p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Eastern Europe: Growth, Transition, and Opportunity.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Edunancial Eastern Europe is being built for founders and entrepreneurs operating in Poland, Romania, Czech Republic, Hungary, Bulgaria, Serbia, Croatia, Slovakia, and the Baltic states. Every curriculum track — RED, WHITE, and BLUE — will be localized and ready.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/membership"
            className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700"
          >
            Become a Member
          </Link>
          <Link
            href="/assessment"
            className="rounded-xl border border-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-slate-950"
          >
            Start Assessment
          </Link>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-950/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-16 md:grid-cols-4">
          {launchPriorities.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-lg font-bold leading-8">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-3xl font-black text-white">Key Markets</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              country: "Poland",
              detail: "Largest Eastern European economy with a strong startup ecosystem.",
            },
            {
              country: "Romania",
              detail: "Rapidly growing tech sector and EU-integrated markets.",
            },
            {
              country: "Czech Republic",
              detail: "Advanced manufacturing, investment, and business infrastructure.",
            },
            {
              country: "Hungary",
              detail: "Business formation and regional capital access.",
            },
            {
              country: "Baltic States",
              detail: "Estonia, Latvia, Lithuania — digital-first economies.",
            },
            {
              country: "Balkans",
              detail: "Serbia, Croatia, Bulgaria — emerging growth markets.",
            },
          ].map((m) => (
            <div
              key={m.country}
              className="rounded-2xl border border-white/10 bg-slate-900 p-6"
            >
              <h3 className="text-xl font-bold text-white">{m.country}</h3>
              <p className="mt-2 text-slate-300">{m.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
