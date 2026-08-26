import { REGION_ARCHITECTURE, effectiveCountryControls } from "@/lib/regions/architecture";

export default function CountryActivation() {
  const rows = Object.values(REGION_ARCHITECTURE).flatMap((region) =>
    region.countries.map((country) => ({ region, country, controls: effectiveCountryControls(country) })),
  );

  return (
    <section className="rounded-xl bg-slate-900 p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black">Country Activation</h2>
          <p className="mt-2 text-sm text-slate-400">
            Live configuration view generated from the canonical country registry. No duplicate country cards.
          </p>
        </div>
        <div className="text-sm text-slate-400">{rows.length} configured countries</div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-slate-950/70 text-left text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Region / Segment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Languages</th>
              <th className="px-4 py-3">Currencies</th>
              <th className="px-4 py-3">Commerce</th>
              <th className="px-4 py-3">Policy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-slate-800/50">
            {rows.map(({ region, country, controls }) => (
              <tr key={`${region.code}-${country.countryCode}`}>
                <td className="px-4 py-3">
                  <div className="font-bold text-white">{country.name}</div>
                  <div className="text-xs text-slate-500">{country.countryCode}</div>
                </td>
                <td className="px-4 py-3 text-slate-300">
                  <div>{region.name}</div>
                  <div className="text-xs text-slate-500">{country.subregion ?? "Unassigned"}</div>
                </td>
                <td className="px-4 py-3 font-bold text-slate-200">{country.launchState ?? region.launchState}</td>
                <td className="px-4 py-3 text-slate-300">{country.languages.join(", ")}</td>
                <td className="px-4 py-3 text-slate-300">{country.currencies.join(", ")}</td>
                <td className="px-4 py-3">
                  <span className={`font-bold ${controls.paidCommerce ? "text-emerald-300" : "text-slate-500"}`}>
                    {controls.paidCommerce ? "Enabled" : "Off"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">{country.activationPolicy ?? "standard"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
