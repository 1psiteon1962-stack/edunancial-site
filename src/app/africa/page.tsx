import type { Metadata } from "next";
import { createAfricaRegionSEO } from "@/lib/africa/seo";
import { AFRICA_REGION_ENABLED } from "@/lib/africa/config";
import { AFRICA_COUNTRIES } from "@/lib/africa/countries";

export const metadata: Metadata = createAfricaRegionSEO();

export default function AfricaPage() {
  if (!AFRICA_REGION_ENABLED) {
    return (
      <main className="min-h-screen bg-[#08101f] text-white flex items-center justify-center">
        <section className="max-w-2xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-black mb-6">
            Edunancial Africa
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            We are building financial education for African entrepreneurs.
            Join the waitlist for early access.
          </p>
          <p className="text-sm text-slate-500">
            This region is in private beta. Check back soon.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h1 className="text-6xl font-black mb-6">Edunancial Africa</h1>
        <p className="text-2xl text-slate-300 mb-16 max-w-3xl">
          Affordable financial education, business tools, and mentorship for
          entrepreneurs across{" "}
          {AFRICA_COUNTRIES.length} African nations.
        </p>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {AFRICA_COUNTRIES.map((country) => (
            <div
              key={country.isoCode}
              className="rounded-xl border border-slate-700 bg-slate-800 p-4"
            >
              <span className="text-xs text-slate-400 uppercase">
                {country.isoCode}
              </span>
              <p className="mt-1 font-semibold">{country.name}</p>
              <p className="mt-1 text-xs text-slate-400">
                {country.currencyCode}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
