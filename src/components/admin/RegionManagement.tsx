import Link from "next/link";
import { REGION_ARCHITECTURE } from "@/lib/regions/architecture";

export default function RegionManagement() {
  const regions = Object.values(REGION_ARCHITECTURE);

  return (
    <section className="rounded-xl bg-slate-900 p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white">Region Management</h2>
          <p className="mt-2 text-sm text-slate-400">
            Generated from the canonical regional architecture. Region and segment changes appear here automatically.
          </p>
        </div>
        <div className="text-sm text-slate-400">
          {regions.length} regions · {regions.reduce((sum, region) => sum + region.countries.length, 0)} configured countries
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {regions.map((region) => (
          <article key={region.code} className="rounded-xl border border-white/10 bg-slate-800/70 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link href={`/${region.routeSlug}`} className="text-xl font-black text-white hover:text-blue-300">
                  {region.name}
                </Link>
                <p className="mt-1 text-xs text-slate-500 font-mono">{region.telemetryNamespace ?? region.code}</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-200">
                {region.launchState}
              </span>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-slate-500">Countries</dt>
                <dd className="mt-1 font-bold text-white">{region.countries.length}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Reporting currency</dt>
                <dd className="mt-1 font-bold text-white">{region.reportingCurrency ?? "Not assigned"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Languages</dt>
                <dd className="mt-1 text-slate-200">{region.languages.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Runtime</dt>
                <dd className="mt-1 text-slate-200">{region.independentRuntime ? "Independent" : "Shared"}</dd>
              </div>
            </dl>

            {region.operatingSegments?.length ? (
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Operating segments</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {region.operatingSegments.map((segment) => (
                    <span key={segment.code} className="rounded-lg bg-slate-950/60 px-3 py-2 text-xs text-slate-200">
                      {segment.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
