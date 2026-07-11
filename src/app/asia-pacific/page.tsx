import Link from "next/link";

const launchPriorities = [
  "Financial competency for Philippines, India, Singapore, and Japan",
  "Business formation across diverse Asia-Pacific regulatory environments",
  "Mobile-first delivery for high-smartphone-penetration markets",
  "Multi-language: English, Tagalog, Hindi, Mandarin, Japanese, Korean",
];

export const metadata = {
  title: "Edunancial Asia-Pacific | Financial Competency Platform",
  description:
    "Edunancial Asia-Pacific helps members in the Philippines, India, Singapore, Australia, Japan, South Korea, and neighboring countries build financial competency through structured education.",
};

export default function AsiaPacificPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          Asia-Pacific
        </p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Asia-Pacific: The world's fastest-growing opportunity.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Edunancial Asia-Pacific is being built for founders and households across the Philippines, India, Singapore, Australia, Japan, South Korea, Indonesia, Malaysia, Vietnam, and the entire Asia-Pacific region. Every curriculum track — RED, WHITE, and BLUE — will be localized for each major market.
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
              country: "Philippines",
              detail: "English-language market with deep diaspora financial education need.",
            },
            {
              country: "India",
              detail: "Largest democracy with a massive and rapidly growing startup ecosystem.",
            },
            {
              country: "Singapore",
              detail: "Global financial hub and Southeast Asia gateway.",
            },
            {
              country: "Australia",
              detail: "English-language market with world-class financial infrastructure.",
            },
            {
              country: "Japan",
              detail: "Advanced economy with structured finance and investment culture.",
            },
            {
              country: "Southeast Asia",
              detail: "Indonesia, Malaysia, Vietnam, Thailand — high-growth emerging markets.",
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
