import Link from "next/link";

const launchPriorities = [
  "Financial systems across the EU and beyond",
  "Business formation, compliance, and reporting",
  "Investment markets and capital access in Western Europe",
  "Cross-border trade, VAT, and regulatory navigation",
];

export const metadata = {
  title: "Edunancial Western Europe | Financial Competency Platform",
  description:
    "Edunancial Western Europe helps members in France, Germany, Spain, Portugal, Italy, and the UK build financial competency through structured education.",
};

export default function WesternEuropePage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          Europe — Western Segment
        </p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Western Europe: Structure, Compliance, and Capital.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Edunancial Western Europe is being built for founders and entrepreneurs operating in France, Germany, Spain, Portugal, Italy, Belgium, the Netherlands, Switzerland, and the United Kingdom. Every curriculum track — RED, WHITE, and BLUE — will be localized and ready.
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
              country: "France",
              detail: "Business registration, banking, and investment frameworks.",
            },
            {
              country: "Germany",
              detail: "GmbH formation, compliance, and capital markets.",
            },
            {
              country: "Spain",
              detail: "Entrepreneurship, export, and EU market entry.",
            },
            {
              country: "Portugal",
              detail: "Startup ecosystem and cross-border commerce.",
            },
            {
              country: "Italy",
              detail: "Business structure, taxation, and market dynamics.",
            },
            {
              country: "United Kingdom",
              detail: "Post-Brexit business compliance and capital access.",
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
