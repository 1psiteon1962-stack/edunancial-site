const metrics = [
  ["Global Revenue", "$0"],
  ["Global Profit", "$0"],
  ["Global Margin", "0%"],
  ["Customers", "0"],
  ["Subscribers", "0"],
  ["LTV", "$0"],
  ["CAC", "$0"],
  ["ROAS", "0"],
  ["MoM Growth", "0%"],
  ["Alerts", "0"],
];

const highlights = [
  { label: "Top Region", value: "—" },
  { label: "Top Product", value: "—" },
  { label: "Top Country", value: "—" },
  { label: "Best-Selling Book", value: "—" },
  { label: "Best-Selling Course", value: "—" },
  { label: "Active Campaigns", value: "0" },
];

export default function ExecutiveSummary() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Executive
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Executive Summary
        </h1>
        <p className="mt-3 text-gray-400">
          Consolidated performance snapshot for executive review.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-5 mb-10">
        {metrics.map(([title, value]) => (
          <div key={title} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-slate-400 text-sm">{title}</p>
            <h2 className="mt-3 text-2xl font-bold">{value}</h2>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
        <h2 className="font-bold mb-5">Highlights</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {highlights.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
              <span className="text-sm text-gray-400">{label}</span>
              <span className="text-sm font-bold text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
