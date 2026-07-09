const stats = [
  { label: "Global Revenue", value: "$0.00", change: "+0%", positive: true },
  { label: "Net Profit", value: "$0.00", change: "+0%", positive: true },
  { label: "Profit Margin", value: "0%", change: "+0%", positive: true },
  { label: "Members", value: "0", change: "+0", positive: true },
  { label: "Books Sold", value: "0", change: "+0", positive: true },
  { label: "Courses Sold", value: "0", change: "+0", positive: true },
  { label: "Countries Active", value: "0", change: "+0", positive: true },
  { label: "Regions Active", value: "0", change: "+0", positive: true },
];

const recentActivity = [
  { action: "Platform initialized", time: "Just now", type: "system" },
  { action: "Admin portal accessed", time: "Just now", type: "admin" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Executive
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Executive Dashboard
        </h1>
        <p className="mt-3 text-gray-400">
          Core business performance metrics for the Edunancial platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
        {stats.map(({ label, value, change, positive }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <p className="text-gray-400 text-sm">{label}</p>
            <h2 className="mt-3 text-3xl font-black">{value}</h2>
            <p className={`mt-2 text-xs font-semibold ${positive ? "text-green-400" : "text-red-400"}`}>
              {change} this month
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <h2 className="font-bold mb-4">Revenue by Region</h2>
          <div className="space-y-3">
            {["North America", "Caribbean", "Latin America", "Europe", "Africa", "Asia Pacific"].map((region) => (
              <div key={region} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{region}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-0 bg-blue-500 rounded-full" />
                  </div>
                  <span className="text-sm font-semibold text-gray-400 w-14 text-right">$0.00</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <h2 className="font-bold mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {recentActivity.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${item.type === "system" ? "bg-blue-400" : "bg-green-400"}`} />
                <div>
                  <p className="text-sm text-gray-200">{item.action}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </main>
  );
}
