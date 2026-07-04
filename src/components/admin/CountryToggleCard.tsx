import { CountryConfiguration } from "@/types/country-config";

interface Props {

  country: CountryConfiguration;

}

export default function CountryToggleCard({

  country,

}: Props) {

  return (

    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <h3 className="font-bold">

            {country.country}

          </h3>

          <p className="text-sm text-slate-500">

            {country.continent}

          </p>

        </div>

        <div>

          {country.enabled ? "🟢 Enabled" : "🔴 Disabled"}

        </div>

      </div>

    </div>

  );

}
