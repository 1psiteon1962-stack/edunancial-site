import { REGION_ARCHITECTURE } from "@/lib/regions/architecture";

const stateLabel = (state?: string) => {
  if (state === "ACTIVE") return "LIVE";
  if (state === "BETA") return "BETA";
  if (state === "DISABLED") return "DISABLED";
  return "PRIVATE";
};

export default function CountryRolloutControl() {
  const countries = Object.values(REGION_ARCHITECTURE).flatMap((region) =>
    region.countries.map((country) => ({
      ...country,
      regionName: region.name,
      effectiveState: country.launchState ?? region.launchState,
    })),
  );

  return (
    <section className="bg-[#08101f] py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-5xl font-black">Country Rollout Control</h2>
            <p className="mt-3 max-w-3xl text-sm text-slate-400">
              Country availability is generated from the canonical regional architecture. No separate rollout list is maintained here.
            </p>
          </div>
          <p className="text-sm text-slate-400">{countries.length} configured countries</p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {countries.map((country) => (
            <article key={country.countryCode} className="rounded-xl border border-slate-700 bg-[#111827] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{country.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{country.regionName} · {country.countryCode}</p>
                </div>
                <span className="text-xs font-bold text-slate-200">{stateLabel(country.effectiveState)}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-400">
                <p>Languages: {country.languages.join(", ") || "Not configured"}</p>
                <p>Currencies: {country.currencies.join(", ") || "Not configured"}</p>
                <p>Commerce: {country.serviceControls?.paidCommerce ? "Enabled" : "Off"}</p>
                <p>Marketing: {country.serviceControls?.marketing ? "Enabled" : "Off"}</p>
              </div>
              {country.activationPolicy && country.activationPolicy !== "standard" ? (
                <p className="mt-4 text-xs font-semibold text-amber-300">Activation policy: {country.activationPolicy}</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
