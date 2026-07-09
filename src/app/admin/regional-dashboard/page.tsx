const regions = [
  { name: "North America", countries: 3, customers: 0, revenue: "$0.00", margin: "0%", status: "Active" },
  { name: "Caribbean", countries: 15, customers: 0, revenue: "$0.00", margin: "0%", status: "Active" },
  { name: "Latin America", countries: 20, customers: 0, revenue: "$0.00", margin: "0%", status: "Active" },
  { name: "Europe", countries: 30, customers: 0, revenue: "$0.00", margin: "0%", status: "Planned" },
  { name: "Africa", countries: 54, customers: 0, revenue: "$0.00", margin: "0%", status: "Planned" },
  { name: "Middle East", countries: 18, customers: 0, revenue: "$0.00", margin: "0%", status: "Planned" },
  { name: "Asia Pacific", countries: 40, customers: 0, revenue: "$0.00", margin: "0%", status: "Planned" },
  { name: "Oceania", countries: 14, customers: 0, revenue: "$0.00", margin: "0%", status: "Planned" },
];

const statusColor: Record<string, string> = {
  Active: "bg-green-500/10 text-green-400",
  Planned: "bg-yellow-500/10 text-yellow-400",
};

export default function RegionalDashboard() {
  const totalRevenue = "$0.00";
  const activeRegions = regions.filter((r) => r.status === "Active").length;

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Global
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Regional Executive Dashboard
        </h1>
        <p className="mt-3 text-gray-400">
          Performance overview across all global regions.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {[
          { label: "Total Regions", value: regions.length },
          { label: "Active Regions", value: activeRegions },
          { label: "Global Revenue", value: totalRevenue },
          { label: "Total Countries", value: regions.reduce((s, r) => s + r.countries, 0) },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-gray-400 text-sm">{label}</p>
            <h2 className="text-3xl font-bold mt-2">{value}</h2>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#101a2f] border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="font-bold">Region Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr>
                {["Region", "Countries", "Customers", "Revenue", "Margin", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-400 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {regions.map((r) => (
                <tr key={r.name} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-semibold">{r.name}</td>
                  <td className="px-6 py-4 text-gray-400">{r.countries}</td>
                  <td className="px-6 py-4 text-gray-400">{r.customers}</td>
                  <td className="px-6 py-4 font-mono">{r.revenue}</td>
                  <td className="px-6 py-4 text-gray-400">{r.margin}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusColor[r.status]}`}>
                      {r.status}
                    </span>
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
