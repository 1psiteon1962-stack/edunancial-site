import Link from "next/link";

import RegionAnalyticsHook from "@/components/regions/RegionAnalyticsHook";
import {
  type GlobalRegionArchitecture,
  getRegionSectionPath,
} from "@/lib/globalRegionArchitecture";

type RegionalLandingPageProps = {
  region: GlobalRegionArchitecture;
};

export default function RegionalLandingPage({
  region,
}: RegionalLandingPageProps) {
  return (
    <main
      className="min-h-screen bg-[#08101f] text-white"
      data-region={region.slug}
      data-analytics-region={region.analyticsKey}
    >
      <RegionAnalyticsHook region={region.slug} surface="landing" />

      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          {region.eyebrow}
        </p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          {region.title}
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          {region.description}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={getRegionSectionPath(region.slug, "membership")}
            className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700"
          >
            Regional Membership
          </Link>
          <Link
            href={getRegionSectionPath(region.slug, "assessment")}
            className="rounded-xl border border-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-slate-950"
          >
            Assessment Placeholder
          </Link>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-950/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-16 md:grid-cols-4">
          {region.highlights.map((item) => (
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
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-3xl font-black text-white">
              Localization and pricing
            </h2>
            <div className="mt-6 space-y-4 text-slate-300">
              <p>
                <span className="font-bold text-white">Default language:</span>{" "}
                {region.defaultLanguage}
              </p>
              <p>
                <span className="font-bold text-white">Supported languages:</span>{" "}
                {region.supportedLanguages.join(", ")}
              </p>
              <p>
                <span className="font-bold text-white">Locale:</span>{" "}
                {region.locale}
              </p>
              <p>
                <span className="font-bold text-white">Currencies:</span>{" "}
                {region.supportedCurrencies.join(", ")}
              </p>
              <p>
                <span className="font-bold text-white">Security model:</span>{" "}
                {region.securityModel}
              </p>
              <p>
                <span className="font-bold text-white">Future curriculum upload path:</span>{" "}
                <code className="rounded bg-slate-950 px-2 py-1 text-sm">
                  {region.curriculumUploadPath}
                </code>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-3xl font-black text-white">Regional pricing</h2>
            <div className="mt-6 space-y-4">
              {region.pricing.products.map((product) => (
                <div
                  key={product.sku}
                  className="rounded-xl border border-white/10 bg-slate-950/70 p-4"
                >
                  <p className="text-lg font-bold text-white">
                    {product.label} — {region.pricing.currency} {product.price}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    {product.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {region.markets.map((market) => (
            <div
              key={market}
              className="rounded-2xl border border-white/10 bg-slate-900 p-6"
            >
              <h3 className="text-xl font-bold text-white">{market}</h3>
              <p className="mt-2 text-slate-300">
                Shared navigation, legal routing, dashboard access, and
                localization scaffolding are enabled for this market grouping.
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
