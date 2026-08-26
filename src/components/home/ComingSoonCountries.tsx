import { REGION_ARCHITECTURE } from "@/lib/regions/architecture";

export default function ComingSoonCountries() {
  const pendingRegions = Object.values(REGION_ARCHITECTURE).filter((region) => region.launchState !== "ACTIVE");

  return (
    <section className="mt-10">
      <h2 className="text-3xl font-bold">International Expansion</h2>
      <p className="mt-2 text-sm text-slate-500">
        Expansion regions are generated from the canonical operating architecture. Countries remain private until explicitly activated.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pendingRegions.map((region) => (
          <article key={region.code} className="rounded-lg border bg-slate-50 p-4">
            <p className="font-bold">{region.name}</p>
            <p className="mt-1 text-xs text-slate-500">{region.launchState}</p>
            <p className="mt-3 text-sm text-slate-700">{region.countries.length} configured countries</p>
            {region.operatingSegments?.length ? (
              <p className="mt-1 text-xs text-slate-500">{region.operatingSegments.map((segment) => segment.name).join(" · ")}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
