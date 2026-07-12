import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://www.edunancial.com";

const launchPriorities = [
  "Island economy dynamics and multilingual financial education",
  "Business formation in Dominican Republic, Puerto Rico, and Jamaica",
  "Currency diversity: USD, DOP, JMD, HTG, and regional variants",
  "Financial competency tailored to Caribbean markets and culture",
];

export const metadata: Metadata = {
  title: "Edunancial Caribbean | Financial Competency Platform",
  description:
    "Edunancial Caribbean helps members across the Dominican Republic, Puerto Rico, Jamaica, Haiti, Cuba, and island nations build financial competency through structured education.",
  alternates: {
    canonical: `${BASE_URL}/caribbean`,
    languages: {
      "en": `${BASE_URL}/caribbean`,
      "es": `${BASE_URL}/caribbean`,
      "fr": `${BASE_URL}/caribbean`,
      "nl": `${BASE_URL}/caribbean`,
      "ht": `${BASE_URL}/caribbean`,
      "x-default": `${BASE_URL}/caribbean`,
    },
  },
  openGraph: {
    title: "Edunancial Caribbean | Financial Competency Platform",
    description:
      "Edunancial Caribbean helps members across the Dominican Republic, Puerto Rico, Jamaica, Haiti, Cuba, and island nations build financial competency through structured education.",
    url: `${BASE_URL}/caribbean`,
    siteName: "Edunancial",
    locale: "en_029",
    type: "website",
  },
};

export default function CaribbeanPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          Caribbean
        </p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Caribbean: Discipline and enterprise across island nations.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Edunancial Caribbean is being built for founders and households across the Dominican Republic, Puerto Rico, Jamaica, Haiti, Cuba, Trinidad and Tobago, Barbados, and the entire island-nation region. Every curriculum track — RED, WHITE, and BLUE — will be localized in English, Spanish, French, and Haitian Creole.
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
              country: "Dominican Republic",
              detail: "One of the fastest-growing economies in the Caribbean.",
            },
            {
              country: "Puerto Rico",
              detail: "U.S.-aligned market with bilingual English and Spanish content.",
            },
            {
              country: "Jamaica",
              detail: "Entrepreneurial culture and English-language financial education.",
            },
            {
              country: "Haiti",
              detail: "Haitian Creole and French-language financial competency content.",
            },
            {
              country: "Trinidad & Tobago",
              detail: "Energy-based economy with growing entrepreneurial ecosystem.",
            },
            {
              country: "Island Nations",
              detail: "Barbados, Grenada, St. Lucia, Bahamas, and all CARICOM markets.",
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
