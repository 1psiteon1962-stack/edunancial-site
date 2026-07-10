/**
 * LATAM Region Landing Page
 *
 * This page is gated by the LATAM launch control.
 * While regionStatus is "PRIVATE", the page renders a private/coming-soon
 * view and is marked noindex — ensuring zero public exposure.
 *
 * To make this page public, change LATAM_REGION_CONFIG.launchControl.regionStatus
 * to "ACTIVE" in src/lib/regions/latam/config.ts.
 */

import type { Metadata } from "next";
import { LATAM_REGION_CONFIG } from "@/lib/regions/latam/config";
import { isPublic, isAccessible } from "@/lib/global/launch-control";
import { createRegionalMetadata } from "@/lib/global/seo-framework";
import {
  CENTRAL_AMERICA_COUNTRIES,
  SOUTH_AMERICA_COUNTRIES,
  CARIBBEAN_COUNTRIES,
} from "@/lib/regions/latam/countries";

const launchStatus = LATAM_REGION_CONFIG.launchControl.regionStatus;

export const metadata: Metadata = createRegionalMetadata({
  title: "Edunancial Latin America | Educación Financiera para América Latina",
  description:
    "Financial education for Latin America — empowering entrepreneurs, families, and professionals across Mexico, Central America, South America, and the Caribbean.",
  path: "/latam",
  locale: "es",
  launchStatus,
});

export default function LATAMPage() {
  // Non-accessible statuses return a minimal private page
  if (!isAccessible(launchStatus)) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-lg px-6 py-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Próximamente · Em breve · Coming Soon
          </p>
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Edunancial Latinoamérica
          </h1>
          <p className="text-lg text-gray-600">
            Estamos construyendo algo especial para América Latina.
          </p>
        </div>
      </main>
    );
  }

  const isLive = isPublic(launchStatus);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-900 to-green-700 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {!isLive && (
            <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
              Beta
            </span>
          )}
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Edunancial Latinoamérica
          </h1>
          <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8">
            Educación financiera para emprendedores, familias y profesionales de
            América Latina y el Caribe.
          </p>
          <p className="text-base text-green-200">
            Educação financeira para a América Latina · Financial Education for Latin America
          </p>
        </div>
      </section>

      {/* Sub-regions */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            Cobertura Regional
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Central America */}
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-green-900 mb-4">
                América Central
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {CENTRAL_AMERICA_COUNTRIES.map((c) => (
                  <li key={c.code}>{c.name}</li>
                ))}
              </ul>
            </div>

            {/* South America */}
            <div className="bg-emerald-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-emerald-900 mb-4">
                América del Sur
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {SOUTH_AMERICA_COUNTRIES.map((c) => (
                  <li key={c.code}>{c.name}</li>
                ))}
              </ul>
            </div>

            {/* Caribbean */}
            <div className="bg-teal-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-teal-900 mb-4">Caribe</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {CARIBBEAN_COUNTRIES.map((c) => (
                  <li key={c.code}>{c.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Idiomas</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "Español", code: "es" },
              { label: "Português", code: "pt" },
              { label: "English", code: "en" },
              { label: "Français", code: "fr" },
              { label: "Nederlands", code: "nl" },
            ].map((lang) => (
              <span
                key={lang.code}
                className="bg-white border border-gray-200 rounded-full px-5 py-2 text-sm font-medium text-gray-700 shadow-sm"
              >
                {lang.label}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
