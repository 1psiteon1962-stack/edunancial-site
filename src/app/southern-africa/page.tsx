import Link from "next/link";

const launchPriorities = [
  "Financial education for South Africa, Zimbabwe, Zambia, and Mozambique",
  "Business formation in Southern African markets",
  "SADC regional frameworks and cross-border commerce",
  "Rand, Kwacha, and multicurrency financial planning",
];

export const metadata = {
  title: "Edunancial Southern Africa | Financial Competency Platform",
  description:
    "Edunancial Southern Africa helps members in South Africa, Zimbabwe, Zambia, Mozambique, Botswana, and neighboring countries build financial competency through structured education.",
};

export default function SouthernAfricaPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          Africa — Southern Segment
        </p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Southern Africa: Structure, resilience, and ambition.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Edunancial Southern Africa is being built for founders and households across South Africa, Zimbabwe, Zambia, Mozambique, Botswana, Namibia, Malawi, and the broader SADC region. Every curriculum track — RED, WHITE, and BLUE — will be localized and ready.
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
              country: "South Africa",
              detail: "Continent's most advanced financial infrastructure and capital markets.",
            },
            {
              country: "Zimbabwe",
              detail: "Resilient entrepreneurship in complex currency environments.",
            },
            {
              country: "Zambia",
              detail: "Growing SME sector and natural resource-driven economy.",
            },
            {
              country: "Mozambique",
              detail: "Portuguese-language market with emerging LNG and trade economy.",
            },
            {
              country: "Botswana",
              detail: "Stable, diamond-backed economy with growing diversification.",
            },
            {
              country: "SADC Region",
              detail: "Namibia, Malawi, Lesotho, Eswatini, and all SADC member states.",
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
