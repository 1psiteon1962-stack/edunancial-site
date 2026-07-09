const regions = [
  {
    name: "North America",
    slug: "north-america",
    countries: 3,
    languages: ["English", "Spanish", "French"],
    status: "Active",
    currency: "USD",
  },
  {
    name: "Caribbean",
    slug: "caribbean",
    countries: 15,
    languages: ["English", "Spanish", "French", "Dutch"],
    status: "Active",
    currency: "Multi",
  },
  {
    name: "Latin America",
    slug: "latam",
    countries: 20,
    languages: ["Spanish", "Portuguese"],
    status: "Active",
    currency: "Multi",
  },
  {
    name: "Europe",
    slug: "europe",
    countries: 30,
    languages: ["English", "German", "French", "Italian", "Spanish"],
    status: "Planned",
    currency: "EUR",
  },
  {
    name: "Africa",
    slug: "africa",
    countries: 54,
    languages: ["English", "French", "Arabic", "Swahili", "Portuguese"],
    status: "Planned",
    currency: "Multi",
  },
  {
    name: "Middle East",
    slug: "middle-east",
    countries: 18,
    languages: ["Arabic", "English"],
    status: "Planned",
    currency: "Multi",
  },
  {
    name: "Asia Pacific",
    slug: "asia",
    countries: 40,
    languages: ["English", "Japanese", "Korean", "Mandarin"],
    status: "Planned",
    currency: "Multi",
  },
  {
    name: "Oceania",
    slug: "oceania",
    countries: 14,
    languages: ["English"],
    status: "Planned",
    currency: "AUD",
  },
];

const statusColor: Record<string, string> = {
  Active: "bg-green-500/10 text-green-400",
  Planned: "bg-yellow-500/10 text-yellow-400",
  Inactive: "bg-red-500/10 text-red-400",
};

export default function RegionsAdminPage() {
  const activeCount = regions.filter((r) => r.status === "Active").length;
  const plannedCount = regions.filter((r) => r.status === "Planned").length;

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Global
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Regions
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Configure and monitor all global regions for the Edunancial platform.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {[
          { label: "Total Regions", value: regions.length },
          { label: "Active", value: activeCount },
          { label: "Planned", value: plannedCount },
          { label: "Total Countries", value: regions.reduce((s, r) => s + r.countries, 0) },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-gray-400 text-sm">{label}</p>
            <h2 className="mt-2 text-4xl font-black">{value}</h2>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#101a2f] border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-bold">All Regions</h2>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-700 transition-colors">
            Add Region
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr>
                {["Region", "Countries", "Languages", "Currency", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-400 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {regions.map((region) => (
                <tr key={region.slug} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-semibold">{region.name}</td>
                  <td className="px-6 py-4 text-gray-400">{region.countries}</td>
                  <td className="px-6 py-4 text-gray-400">{region.languages.slice(0, 3).join(", ")}{region.languages.length > 3 ? ` +${region.languages.length - 3}` : ""}</td>
                  <td className="px-6 py-4 text-gray-400">{region.currency}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusColor[region.status]}`}>
                      {region.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-400 hover:text-blue-300 text-xs font-semibold">
                      Configure
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
}
