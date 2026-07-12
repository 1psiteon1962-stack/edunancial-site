import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://www.edunancial.com";
const PAGE_PATH = "/latin-america";

const launchPriorities = [
  "Informality to structure: unlocking capital and protection",
  "Currency risk, political dynamics, and planning discipline",
  "Business formation in Mexico, Colombia, Argentina, and Brazil",
  "Cross-border expansion across Spanish and Portuguese markets",
];

export const metadata: Metadata = {
  title: "Edunancial Latin America | Financial Competency Platform",
  description:
    "Edunancial Latin America helps members across Mexico, Colombia, Argentina, Brazil, and all of South and Central America build financial competency through structured education.",
  alternates: {
    canonical: `${BASE_URL}${PAGE_PATH}`,
    languages: {
      "x-default": `${BASE_URL}${PAGE_PATH}`,
      es: `${BASE_URL}/latin-america-2a`,
      "es-419": `${BASE_URL}/latin-america-2a`,
      "es-MX": `${BASE_URL}/latin-america-2a`,
      pt: `${BASE_URL}/latin-america-2b`,
      "pt-BR": `${BASE_URL}/latin-america-2b`,
      en: `${BASE_URL}${PAGE_PATH}`,
    },
  },
  openGraph: {
    title: "Edunancial Latin America | Financial Competency Platform",
    description:
      "Build financial competency across Mexico, Colombia, Argentina, Brazil, and all of Latin America.",
    url: `${BASE_URL}${PAGE_PATH}`,
    siteName: "Edunancial",
    locale: "es_419",
    type: "website",
  },
  keywords: [
    "educación financiera latinoamérica",
    "competencia financiera",
    "finanzas méxico",
    "finanzas colombia",
    "educación financiera brasil",
    "inversión latinoamérica",
    "negocios latinoamérica",
    "edunancial",
  ],
};

export default function LatinAmericaPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          Latin America
        </p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Latin America: Structure meets opportunity.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Edunancial Latin America is being built for founders and households across Mexico, Colombia, Peru, Argentina, Brazil, Chile, Ecuador, and all of Central and South America. Every curriculum track — RED, WHITE, and BLUE — will be fully localized in Spanish and Portuguese.
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
              country: "Mexico",
              detail: "North America's gateway to Latin commerce and business culture.",
            },
            {
              country: "Colombia",
              detail: "Fast-growing startup ecosystem and entrepreneurial energy.",
            },
            {
              country: "Brazil",
              detail: "Largest economy in Latin America with Portuguese-language content.",
            },
            {
              country: "Argentina",
              detail: "Resilient entrepreneurship in complex economic conditions.",
            },
            {
              country: "Peru",
              detail: "Emerging markets, informality transitions, and capital access.",
            },
            {
              country: "Central America",
              detail: "Guatemala, Honduras, El Salvador, Nicaragua, Costa Rica, Panama.",
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

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-black text-white">Regional Architecture</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Link
            href="/latin-america-2a"
            className="rounded-2xl border border-white/10 bg-slate-900 p-6 hover:border-blue-500 hover:bg-slate-800 transition-colors"
          >
            <h3 className="text-xl font-bold text-yellow-400">Latin America 2A</h3>
            <p className="mt-2 text-slate-300">
              Spanish-speaking markets: Mexico, Central America, Northern South America.
            </p>
            <p className="mt-2 text-sm text-slate-400">Currencies: USD, MXN, COP, PEN</p>
          </Link>
          <Link
            href="/latin-america-2b"
            className="rounded-2xl border border-white/10 bg-slate-900 p-6 hover:border-blue-500 hover:bg-slate-800 transition-colors"
          >
            <h3 className="text-xl font-bold text-yellow-400">Latin America 2B</h3>
            <p className="mt-2 text-slate-300">
              Portuguese-speaking markets: Brazil, Argentina, Southern South America.
            </p>
            <p className="mt-2 text-sm text-slate-400">Currencies: USD, BRL, ARS, CLP</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
