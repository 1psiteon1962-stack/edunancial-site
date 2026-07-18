import Link from "next/link";

const launchPriorities = [
  "Financial literacy for Uganda, Kenya, Tanzania, and Ethiopia",
  "Business formation in high-growth East African markets",
  "Mobile-first financial systems and M-Pesa ecosystem",
  "Cross-border expansion: EAC and regional trade frameworks",
];

export const metadata = {
  title: "Edunancial East Africa | Financial Competency Platform",
  description:
    "Edunancial East Africa helps members in Uganda, Kenya, Tanzania, Ethiopia, Rwanda, and neighboring countries build financial competency through structured education.",
};

export default function EastAfricaPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          Africa — East Segment
        </p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          East Africa: Innovation, discipline, and growth.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Edunancial East Africa is being built for founders and households across Uganda, Kenya, Tanzania, Ethiopia, Rwanda, Burundi, and the East African Community. Every curriculum track — RED, WHITE, and BLUE — will be ready for mobile-first delivery.
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
              country: "Uganda",
              detail: "Mobile money, entrepreneurial growth, and financial inclusion.",
            },
            {
              country: "Kenya",
              detail: "Tech-forward economy with M-Pesa and fintech leadership.",
            },
            {
              country: "Tanzania",
              detail: "Growing SME sector and agricultural entrepreneurship.",
            },
            {
              country: "Ethiopia",
              detail: "Largest economy in East Africa with a rising startup scene.",
            },
            {
              country: "Rwanda",
              detail: "One of Africa's most business-friendly regulatory environments.",
            },
            {
              country: "EAC Region",
              detail: "Burundi, South Sudan, DRC, and the broader EAC framework.",
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
