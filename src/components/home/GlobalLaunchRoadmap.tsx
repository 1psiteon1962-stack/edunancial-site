import { REGION_ARCHITECTURE } from "@/lib/regions/architecture";

const statusLabel = (state: string) => state === "ACTIVE" ? "LIVE" : state;

export default function GlobalLaunchRoadmap() {
  const regions = Object.values(REGION_ARCHITECTURE);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-5xl font-black text-white">Global Rollout Roadmap</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-400">
            This view reflects the configured operating architecture rather than a separately maintained launch-phase list.
          </p>
        </div>
        <p className="text-sm text-slate-400">{regions.length} operating regions</p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {regions.map((region) => {
          const activeCountries = region.countries.filter((country) => (country.launchState ?? region.launchState) === "ACTIVE");
          return (
            <article key={region.code} className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-blue-400">{region.code}</p>
                  <h3 className="mt-2 text-3xl font-black text-white">{region.name}</h3>
                </div>
                <p className="font-semibold text-green-400">{statusLabel(region.launchState)}</p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 text-sm text-gray-300">
                <p>{region.countries.length} configured countries</p>
                <p>{activeCountries.length} active countries</p>
                <p>{region.operatingSegments?.length ?? 0} operating segments</p>
                <p>{region.independentRuntime ? "Independent runtime" : "Shared runtime"}</p>
              </div>

              {region.operatingSegments?.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {region.operatingSegments.map((segment) => (
                    <span key={segment.code} className="rounded-lg bg-slate-950/60 px-3 py-2 text-xs text-slate-300">
                      {segment.name}
                    </span>
                  ))}
                </div>
              ) : null}

              {activeCountries.length ? (
                <p className="mt-5 text-sm text-gray-300">Live: {activeCountries.map((country) => country.name).join(" · ")}</p>
              ) : (
                <p className="mt-5 text-sm text-slate-500">No countries are publicly active in this region.</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
