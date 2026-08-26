import Link from "next/link";
import { REGION_ARCHITECTURE } from "@/lib/regions/architecture";

export default function GlobalAdministrationDashboard() {
  const regions = Object.values(REGION_ARCHITECTURE);
  const countries = regions.flatMap((region) => region.countries);
  const segments = regions.flatMap((region) => region.operatingSegments ?? []);
  const activeCountries = countries.filter((country) => country.launchState === "ACTIVE").length;
  const disabledCountries = countries.filter((country) => country.launchState === "DISABLED").length;
  const independentSegments = segments.filter((segment) => segment.independentRuntime).length;
  const languages = new Set(regions.flatMap((region) => region.languages));
  const currencies = new Set(regions.flatMap((region) => region.currencies));

  const metrics = [
    ["Regions", regions.length.toLocaleString(), "Canonical operating regions"],
    ["Operating Segments", segments.length.toLocaleString(), "Regional fault-isolation units"],
    ["Configured Countries", countries.length.toLocaleString(), "Country records in the canonical architecture"],
    ["Active Countries", activeCountries.toLocaleString(), "Currently enabled launch markets"],
    ["Disabled Countries", disabledCountries.toLocaleString(), "Explicitly disabled markets"],
    ["Independent Runtimes", independentSegments.toLocaleString(), "Segments marked independently operable"],
    ["Languages", languages.size.toLocaleString(), "Configured regional language codes"],
    ["Currencies", currencies.size.toLocaleString(), "Configured regional currency codes"],
  ] as const;

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-blue-300">Owner · Global Architecture</p>
            <h1 className="mt-3 text-5xl font-black">Global Administration</h1>
            <p className="mt-3 max-w-3xl text-slate-400">
              Architecture-derived operating coverage. Counts update from the canonical region configuration rather than duplicated dashboard cards.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/regions" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold">Country Controls</Link>
            <Link href="/admin/dashboard" className="rounded-lg border border-white/15 px-4 py-2 text-sm font-bold">Live KPI Command Center</Link>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map(([label, value, description]) => (
            <article key={label} className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
              <p className="mt-3 text-4xl font-black">{value}</p>
              <p className="mt-3 text-xs text-slate-500">{description}</p>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black">Operational data</h2>
              <p className="mt-1 text-sm text-slate-400">
                Revenue, memberships, payments, taxes, video production and other live business KPIs remain in the production-backed command center rather than being fabricated here.
              </p>
            </div>
            <Link href="/admin/dashboard" className="text-sm font-bold text-yellow-300">Open live operations →</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
