import { countries } from "@/lib/countries/country-registry";

export default function CountryManagementTable() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold">
        Country Administration
      </h2>

      <table className="mt-8 w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left py-3">Country</th>

            <th className="text-left py-3">Status</th>

            <th className="text-left py-3">Entity</th>

            <th className="text-left py-3">Currency</th>

          </tr>

        </thead>

        <tbody>

          {countries.map((country) => (

            <tr
              key={country.isoCode}
              className="border-b"
            >

              <td className="py-4">
                {country.country}
              </td>

              <td>
                {country.status}
              </td>

              <td>
                {country.operatingEntity}
              </td>

              <td>
                {country.currency}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </section>
  );
}
