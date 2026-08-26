import { REGION_ARCHITECTURE } from "@/lib/regions/architecture";

export default function ComingSoonCountries() {
  const inactiveRegions = Object.values(REGION_ARCHITECTURE).filter((region) => region.launchState !== "ACTIVE");
  const configuredCountries = inactiveRegions.reduce((sum, region) => sum + region.countries.length, 0);

  return (
    <section className="mt-10">
      <h2 className="text-3xl font-bold">Global Expansion</h2>
      <p className="mt-3 max-w-3xl text-sm text-slate-500">
        Future markets are controlled by Edunancial&apos;s regional architecture and country activation policies rather than a manually maintained coming-soon list.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {inactiveRegions.map((region) => (
          <div key={region.code} className="rounded-lg border bg-slate-50 p-4">
            <p className="font-bold">{region.name}</p>
            <p className="mt-1 text-sm text-slate-500">{region.countries.length} configured countries · {region.launchState}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-500">{configuredCountries} countries are configured across non-active regions.</p>
    </section>
  );
}
