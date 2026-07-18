import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edunancial Europe | Financial Competency Platform",
  description:
    "Edunancial Europe delivers structured financial education for founders, entrepreneurs, and households across Western and Eastern Europe. GDPR-compliant, VAT-aware, multilingual.",
  alternates: {
    languages: {
      "en": "/europe",
      "fr": "/europe",
      "de": "/europe",
      "es": "/europe",
      "it": "/europe",
      "pt": "/europe",
      "x-default": "/europe",
    },
  },
  openGraph: {
    title: "Edunancial Europe | Financial Competency for European Markets",
    description:
      "Build financial competency across Europe — covering business formation, VAT, investment, cross-border trade, and EU market entry in English, French, German, Spanish, and Italian.",
    locale: "en_GB",
    alternateLocale: ["fr_FR", "de_DE", "es_ES", "it_IT", "pt_PT"],
    type: "website",
  },
};

const europePriorities = [
  "GDPR-compliant platform for all European members",
  "VAT-aware pricing across 20+ EU and EEA countries",
  "Multilingual: English, French, German, Spanish, Italian, Portuguese",
  "Stripe and PayPal — PSD2-compliant payment processing",
];

const subRegions = [
  {
    slug: "/western-europe",
    label: "Western Europe",
    description:
      "France, Germany, Spain, Italy, Netherlands, Belgium, Portugal, United Kingdom, Switzerland — deep EU market coverage.",
    accent: "EU 2A",
  },
  {
    slug: "/eastern-europe",
    label: "Eastern Europe",
    description:
      "Poland, Romania, Czech Republic, Hungary, Bulgaria, Croatia, Baltic States — fast-growing transition economies.",
    accent: "EU 2B",
  },
];

const keyMarkets = [
  {
    country: "France",
    detail: "Registered members access curricula under RGPD with TVA-inclusive pricing.",
  },
  {
    country: "Germany",
    detail: "GmbH formation, DSGVO compliance, MwSt.-inclusive pricing, and capital markets.",
  },
  {
    country: "Spain",
    detail: "IVA-inclusive pricing, business formation, and EU export strategy.",
  },
  {
    country: "Italy",
    detail: "IVA-compliant curriculum covering S.r.l. formation and investment frameworks.",
  },
  {
    country: "United Kingdom",
    detail: "Post-Brexit compliance, UK GDPR, GBP pricing, and capital access.",
  },
  {
    country: "Poland & Eastern EU",
    detail: "High-growth economies — PLN, CZK, HUF pricing; GDPR-aligned access.",
  },
];

const compliance = [
  {
    label: "GDPR",
    detail: "Full GDPR compliance: consent management, data portability, right to erasure.",
  },
  {
    label: "ePrivacy",
    detail: "Cookie consent banner and preference centre aligned with EU ePrivacy Directive.",
  },
  {
    label: "PSD2",
    detail: "Strong Customer Authentication (SCA) via Stripe, compliant with EU PSD2.",
  },
  {
    label: "VAT / OSS",
    detail: "VAT-inclusive pricing across EU member states, OSS registration–aware logic.",
  },
];

export default function EuropePage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          Edunancial — Europe
        </p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Europe: Structure, Compliance, and Capital.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Edunancial Europe is being built for founders, entrepreneurs, and households
          across more than 20 European countries. Every curriculum track — RED, WHITE, and
          BLUE — will be localized, VAT-aware, and GDPR-compliant in English, French,
          German, Spanish, Italian, and Portuguese.
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

      {/* Priorities */}
      <section className="border-y border-white/10 bg-slate-950/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-16 md:grid-cols-4">
          {europePriorities.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-lg font-bold leading-8">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sub-regions */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-3xl font-black text-white">Regional Segments</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {subRegions.map((r) => (
            <Link
              key={r.slug}
              href={r.slug}
              className="group rounded-2xl border border-white/10 bg-slate-900 p-8 transition hover:border-blue-500"
            >
              <p className="text-xs font-black uppercase tracking-widest text-yellow-400">
                {r.accent}
              </p>
              <h3 className="mt-3 text-2xl font-black text-white group-hover:text-blue-400">
                {r.label}
              </h3>
              <p className="mt-3 text-slate-300">{r.description}</p>
              <span className="mt-4 inline-block text-sm font-bold text-blue-400">
                Explore {r.label} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Key markets */}
      <section className="border-t border-white/10 bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-3xl font-black text-white">Key Markets</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {keyMarkets.map((m) => (
              <div
                key={m.country}
                className="rounded-2xl border border-white/10 bg-slate-900 p-6"
              >
                <h3 className="text-xl font-bold text-white">{m.country}</h3>
                <p className="mt-2 text-slate-300">{m.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-3xl font-black text-white">Compliance Architecture</h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            Every aspect of the European platform is designed around regulatory compliance — from
            data protection to payment processing and VAT handling.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {compliance.map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <p className="text-sm font-black uppercase tracking-widest text-yellow-400">
                  {c.label}
                </p>
                <p className="mt-3 text-slate-300">{c.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/legal/gdpr"
              className="text-sm font-bold text-blue-400 hover:underline"
            >
              GDPR Notice →
            </Link>
            <Link
              href="/legal/privacy"
              className="text-sm font-bold text-blue-400 hover:underline"
            >
              Privacy Policy →
            </Link>
            <Link
              href="/legal/cookies"
              className="text-sm font-bold text-blue-400 hover:underline"
            >
              Cookie Policy →
            </Link>
          </div>
        </div>
      </section>

      {/* Accessibility note */}
      <section className="border-t border-white/10 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm text-slate-400">
            Edunancial Europe targets WCAG 2.1 Level AA accessibility. All pages are
            optimised for screen readers, keyboard navigation, and high-contrast display
            settings. VAT is included in all displayed prices where applicable under EU law.
            All payment processing is handled by PSD2-compliant providers. Legal review is
            required before commercial launch in each member state.
          </p>
        </div>
      </section>
    </main>
  );
}
