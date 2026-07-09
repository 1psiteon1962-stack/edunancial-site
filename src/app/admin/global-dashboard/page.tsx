const cards = [
  ["Revenue", "$0"],
  ["Profit", "$0"],
  ["Expenses", "$0"],
  ["Subscribers", "0"],
  ["Customers", "0"],
  ["Books", "0"],
  ["Courses", "0"],
  ["Memberships", "0"],
  ["LTV", "$0"],
  ["CAC", "$0"],
  ["ROAS", "0"],
  ["Conversion", "0%"],
];

const topRegions = [
  { name: "North America", revenue: "$0", share: "0%" },
  { name: "Caribbean", revenue: "$0", share: "0%" },
  { name: "Latin America", revenue: "$0", share: "0%" },
  { name: "Europe", revenue: "$0", share: "0%" },
  { name: "Africa", revenue: "$0", share: "0%" },
];

export default function GlobalDashboard() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Executive
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Global Executive Dashboard
        </h1>
        <p className="mt-3 text-gray-400">
          Worldwide performance overview across all regions and product lines.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {cards.map(([title, value]) => (
          <div key={title} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-slate-400 text-sm">{title}</p>
            <h2 className="text-3xl font-bold mt-3">{value}</h2>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <h2 className="font-bold mb-5">Revenue by Region</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase border-b border-white/10">
                <th className="text-left pb-3">Region</th>
                <th className="text-right pb-3">Revenue</th>
                <th className="text-right pb-3">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topRegions.map((r) => (
                <tr key={r.name}>
                  <td className="py-3 text-gray-200">{r.name}</td>
                  <td className="py-3 text-right font-semibold">{r.revenue}</td>
                  <td className="py-3 text-right text-gray-400">{r.share}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <h2 className="font-bold mb-5">Platform Health</h2>
          <ul className="space-y-4">
            {[
              { label: "Platform Status", status: "Online", color: "bg-green-400" },
              { label: "Database", status: "Healthy", color: "bg-green-400" },
              { label: "API", status: "Operational", color: "bg-green-400" },
              { label: "Payments", status: "Active", color: "bg-green-400" },
              { label: "CDN", status: "Active", color: "bg-green-400" },
            ].map(({ label, status, color }) => (
              <li key={label} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{label}</span>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${color}`} />
                  <span className="text-sm font-semibold text-gray-200">{status}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </main>
  );
}
