import Link from "next/link";

const launchPriorities = [
  "Financial competency for Nigeria, Ghana, Senegal, and Côte d'Ivoire",
  "Business formation across West Africa's most dynamic economies",
  "Infrastructure, logistics, and payments strategy for founders",
  "ECOWAS regional integration and cross-border expansion",
];

export const metadata = {
  title: "Edunancial West Africa | Financial Competency Platform",
  description:
    "Edunancial West Africa helps members in Nigeria, Ghana, Senegal, Côte d'Ivoire, and neighboring countries build financial competency through structured education.",
};

export default function WestAfricaPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          Africa — West Segment
        </p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          West Africa: Scale, resilience, and enterprise.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Edunancial West Africa is being built for founders and households across Nigeria, Ghana, Senegal, Côte d'Ivoire, Cameroon, Mali, and the broader ECOWAS region. Every curriculum track — RED, WHITE, and BLUE — will be localized for English and French markets.
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
              country: "Nigeria",
              detail: "Africa's largest economy with the continent's biggest startup scene.",
            },
            {
              country: "Ghana",
              detail: "Business-stable English-language market with strong governance.",
            },
            {
              country: "Senegal",
              detail: "French-language financial education and West African hub.",
            },
            {
              country: "Côte d'Ivoire",
              detail: "Rapid economic growth and entrepreneurial momentum.",
            },
            {
              country: "Cameroon",
              detail: "Bilingual English and French business environment.",
            },
            {
              country: "ECOWAS Region",
              detail: "Mali, Burkina Faso, Togo, Benin, Guinea, and all ECOWAS states.",
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
