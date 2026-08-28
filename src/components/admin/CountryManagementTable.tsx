import { getGlobalRolloutSnapshot } from "@/lib/countries/country-readiness-registry";

function readinessLabel(value: boolean) {
  return value ? "Yes" : "No";
}

export default function CountryManagementTable() {
  const countries = getGlobalRolloutSnapshot();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold">Country Administration</h2>
        <p className="mt-2 text-sm text-slate-600">
          Configuration status is separate from launch and commercial readiness. Markets remain blocked until all required readiness dimensions are complete.
        </p>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b text-sm text-slate-600">
              <th className="py-3 text-left">Country</th>
              <th className="py-3 text-left">Status</th>
              <th className="py-3 text-left">Launch Ready</th>
              <th className="py-3 text-left">Commercial Ready</th>
              <th className="py-3 text-left">Missing Readiness</th>
              <th className="py-3 text-left">Currency</th>
            </tr>
          </thead>

          <tbody>
            {countries.map((country) => (
              <tr key={country.isoCode} className="border-b align-top">
                <td className="py-4 pr-5">
                  <div className="font-semibold text-slate-950">{country.country}</div>
                  <div className="mt-1 text-xs text-slate-500">{country.isoCode} · {country.continent}</div>
                </td>
                <td className="py-4 pr-5 capitalize">{country.status}</td>
                <td className="py-4 pr-5 font-semibold">{readinessLabel(country.launchReady)}</td>
                <td className="py-4 pr-5 font-semibold">{readinessLabel(country.commercialReady)}</td>
                <td className="py-4 pr-5 text-sm text-slate-600">
                  {country.missing.length > 0 ? country.missing.join(", ") : "—"}
                </td>
                <td className="py-4">{country.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
