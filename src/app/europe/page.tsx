import Link from "next/link";

const architecturalSegments = [
  {
    label: "Europe 2A — Western Europe",
    href: "/europe/2a",
    description:
      "UK, France, Germany, Spain, Italy, Netherlands, Belgium, Sweden, Switzerland, Austria, and allied markets.",
  },
  {
    label: "Europe 2B — Central & Eastern Europe",
    href: "/europe/2b",
    description:
      "Poland, Romania, Czech Republic, Hungary, Greece, Portugal, Croatia, Slovakia, Bulgaria, and emerging EU markets.",
  },
];

export const metadata = {
  title: "Edunancial Europe | Financial Competency Platform",
  description:
    "Edunancial Europe delivers financial competency education across Western, Central, and Eastern European markets through two dedicated regional segments.",
};

export default function EuropePage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          Europe Regional Architecture
        </p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Financial competency across the European continent.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          The Edunancial European architecture spans two segments — Western Europe (2A) and Central &amp; Eastern Europe (2B) — each purpose-built to deliver Red, White, and Blue curriculum levels to members across their respective markets.
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
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="mb-8 text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
            Architectural Segments
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {architecturalSegments.map((seg) => (
              <Link
                key={seg.href}
                href={seg.href}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 transition hover:border-blue-500/50 hover:bg-white/10"
              >
                <p className="text-xl font-black">{seg.label}</p>
                <p className="mt-3 leading-7 text-slate-300">{seg.description}</p>
                <p className="mt-4 text-sm font-bold text-blue-400">View segment →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
