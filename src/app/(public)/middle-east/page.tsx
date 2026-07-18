import Link from "next/link";

const launchPriorities = [
  "Sharia-compliant and conventional financial education side by side",
  "Business formation in UAE, Saudi Arabia, Qatar, and Kuwait",
  "Arabic and English bilingual curriculum delivery",
  "Regional investment, capital markets, and MENA expansion",
];

export const metadata = {
  title: "Edunancial Middle East | Financial Competency Platform",
  description:
    "Edunancial Middle East helps members in the UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Jordan, and Egypt build financial competency through structured education.",
};

export default function MiddleEastPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          Middle East
        </p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Middle East: Capital, discipline, and global ambition.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Edunancial Middle East is being built for founders and households across the UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Jordan, Lebanon, Egypt, and the broader MENA region. Every curriculum track — RED, WHITE, and BLUE — will be localized in Arabic and English.
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
              country: "UAE",
              detail: "Global business hub with world-class financial infrastructure.",
            },
            {
              country: "Saudi Arabia",
              detail: "Vision 2030 economy with massive entrepreneurship investment.",
            },
            {
              country: "Qatar",
              detail: "Diversification-focused economy with significant capital markets.",
            },
            {
              country: "Kuwait",
              detail: "Oil-backed wealth economy with growing private sector.",
            },
            {
              country: "Egypt",
              detail: "Largest Arab population, Arabic-language financial education hub.",
            },
            {
              country: "Jordan & Levant",
              detail: "Jordan, Lebanon, Iraq — regional commerce and business culture.",
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
