import { REGION_ARCHITECTURE } from "@/lib/regions/architecture";

export default function RegionalAdministrators() {
  const regions = Object.values(REGION_ARCHITECTURE);

  return (
    <section className="rounded-xl bg-slate-900 p-8">
      <h2 className="text-4xl font-black text-white">Regional Administrators</h2>
      <p className="mt-3 max-w-3xl text-sm text-slate-400">
        Regional administrator assignments will appear here only when they are backed by an authenticated administrator and permissions data source. No placeholder people or permission levels are shown.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {regions.map((region) => (
          <article key={region.code} className="rounded-xl border border-white/10 bg-slate-800/60 p-5">
            <p className="font-black text-white">{region.name}</p>
            <p className="mt-2 text-xs text-slate-500">Administrator assignment</p>
            <p className="mt-1 text-sm font-semibold text-slate-300">Not configured</p>
            <p className="mt-3 text-xs text-slate-500">
              {region.operatingSegments?.length ?? 0} operating segment{(region.operatingSegments?.length ?? 0) === 1 ? "" : "s"}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
