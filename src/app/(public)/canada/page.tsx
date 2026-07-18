import type { Metadata } from "next";
import Link from "next/link";
import { CANADA_REGION_CONFIG } from "@/config/canada";

const siteUrl = "https://www.edunancial.com";
const canonicalUrl = `${siteUrl}/canada`;

export const metadata: Metadata = {
  title: "Edunancial Canada | Financial Literacy & Competency Platform",
  description:
    "Edunancial Canada helps Canadians build financial competency through real estate, paper assets, and business education. Available in English and French. Prices in CAD.",
  alternates: {
    canonical: canonicalUrl,
    languages: {
      "en-CA": `${siteUrl}/canada`,
      "fr-CA": `${siteUrl}/fr-CA/canada`,
      "x-default": `${siteUrl}/canada`,
    },
  },
  openGraph: {
    type: "website",
    locale: CANADA_REGION_CONFIG.seo.ogLocaleEnCa,
    alternateLocale: CANADA_REGION_CONFIG.seo.ogLocaleFrCa,
    url: canonicalUrl,
    siteName: CANADA_REGION_CONFIG.seo.siteName,
    title: "Edunancial Canada | Financial Literacy & Competency Platform",
    description:
      "Build financial competency through real estate, paper assets, and business education. Serving Canadians coast to coast.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Edunancial Canada — Financial Literacy & Competency Platform",
      },
    ],
  },
  keywords: [
    "financial literacy Canada",
    "financial competency",
    "Canadian financial education",
    "real estate investing Canada",
    "business education Canada",
    "investing courses Canada",
    "financial freedom Canada",
    "CAD",
    "edunancial",
    "littératie financière",
    "compétence financière",
    "éducation financière Canada",
  ],
};

const highlights = [
  {
    en: "Financial literacy that builds real competency",
    fr: "Une littératie financière qui bâtit une vraie compétence",
  },
  {
    en: "Prices in Canadian dollars (CAD)",
    fr: "Prix en dollars canadiens (CAD)",
  },
  {
    en: "Bilingual platform — English and French",
    fr: "Plateforme bilingue — anglais et français",
  },
  {
    en: "Privacy protected under PIPEDA",
    fr: "Vie privée protégée sous la LPRPDE",
  },
];

export default function CanadaPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-red-500">
          Canada Launch / Lancement Canada
        </p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Build financial competency.{" "}
          <span className="text-red-400">Bâtissez votre compétence financière.</span>
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Edunancial is coming to Canada — a platform built to help Canadians move
          beyond basic financial literacy into disciplined action across real estate,
          paper assets, and business.
        </p>
        <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-400">
          Edunancial arrive au Canada — une plateforme conçue pour aider les
          Canadiens à aller au-delà de la littératie financière de base.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/membership"
            className="rounded-xl bg-red-600 px-8 py-4 text-lg font-bold hover:bg-red-700"
          >
            Become a Member / Devenir membre
          </Link>
          <Link
            href="/assessment"
            className="rounded-xl border border-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-slate-950"
          >
            Start Assessment / Commencer l&apos;évaluation
          </Link>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-950/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-16 md:grid-cols-2">
          {highlights.map((item) => (
            <div
              key={item.en}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-lg font-bold leading-8">{item.en}</p>
              <p className="mt-2 text-base text-slate-400">{item.fr}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-3xl font-black">
          Canada Region / Région canadienne
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-slate-900 p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-red-400">
              Currency / Devise
            </p>
            <p className="mt-3 text-2xl font-black">CAD — Canadian Dollar</p>
            <p className="mt-1 text-slate-400">Dollar canadien</p>
          </div>
          <div className="rounded-xl bg-slate-900 p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-red-400">
              Privacy / Vie privée
            </p>
            <p className="mt-3 text-2xl font-black">PIPEDA / LPRPDE</p>
            <p className="mt-1 text-slate-400">
              Personal Information Protection and Electronic Documents Act
            </p>
          </div>
          <div className="rounded-xl bg-slate-900 p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-red-400">
              Payments / Paiements
            </p>
            <p className="mt-3 text-2xl font-black">Square + Stripe</p>
            <p className="mt-1 text-slate-400">CAD transactions supported</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 border-t border-white/10">
        <h2 className="text-3xl font-black">
          Provinces &amp; Territories / Provinces et territoires
        </h2>
        <p className="mt-4 text-slate-400">
          Province-aware tax calculations and localized content coming with full
          launch. / Calculs de taxes par province et contenu localisé disponibles
          au lancement complet.
        </p>
        <div className="mt-8 grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          {CANADA_REGION_CONFIG.provinces.map((province) => (
            <div
              key={province.code}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-3"
            >
              <p className="font-bold">{province.name}</p>
              <p className="text-sm text-slate-400">{province.nameFr}</p>
              <p className="mt-1 text-xs text-slate-500">
                {province.tax.taxLabel} — {province.tax.totalRate}%
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm text-slate-500">
            Prices shown in CAD. Applicable GST/HST and provincial sales taxes will
            be calculated at checkout based on your province or territory. Privacy
            protected under PIPEDA. / Prix en CAD. Les taxes applicables (TPS/TVH et
            taxes provinciales) seront calculées à la caisse selon votre province ou
            territoire. Vie privée protégée sous la LPRPDE.
          </p>
        </div>
      </section>
    </main>
  );
}
