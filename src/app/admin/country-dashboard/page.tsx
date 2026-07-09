export default function CountryDashboard() {
  const countries = [
    { name: "United States", region: "North America", customers: 0, revenue: "$0.00", status: "Active" },
    { name: "Canada", region: "North America", customers: 0, revenue: "$0.00", status: "Active" },
    { name: "Mexico", region: "North America", customers: 0, revenue: "$0.00", status: "Active" },
    { name: "Jamaica", region: "Caribbean", customers: 0, revenue: "$0.00", status: "Active" },
    { name: "Trinidad", region: "Caribbean", customers: 0, revenue: "$0.00", status: "Active" },
    { name: "Brazil", region: "Latin America", customers: 0, revenue: "$0.00", status: "Active" },
    { name: "Colombia", region: "Latin America", customers: 0, revenue: "$0.00", status: "Active" },
  ];

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Global
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Country Dashboard
        </h1>
        <p className="mt-3 text-gray-400">
          Country-level KPIs, customers and revenue breakdown.
        </p>
      </div>

      <div className="rounded-2xl bg-[#101a2f] border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-4">
          <input
            placeholder="Search country..."
            className="flex-1 rounded-xl bg-[#08101f] border border-white/10 px-4 py-2.5 text-sm placeholder:text-gray-500"
          />
          <select className="rounded-xl bg-[#08101f] border border-white/10 px-4 py-2.5 text-sm">
            <option>All Regions</option>
            <option>North America</option>
            <option>Caribbean</option>
            <option>Latin America</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr>
                {["Country", "Region", "Customers", "Revenue", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-400 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {countries.map((c) => (
                <tr key={c.name} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-semibold">{c.name}</td>
                  <td className="px-6 py-4 text-gray-400">{c.region}</td>
                  <td className="px-6 py-4 text-gray-400">{c.customers}</td>
                  <td className="px-6 py-4 font-mono">{c.revenue}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-green-500/10 text-green-400 px-2.5 py-1 text-xs font-bold">
                      {c.status}
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
