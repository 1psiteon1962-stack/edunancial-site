const cards = [
  ["Subscribers", "0"],
  ["Downloads", "0"],
  ["Email Opens", "0"],
  ["Email Clicks", "0"],
  ["Conversion Rate", "0%"],
  ["CAC", "$0.00"],
  ["LTV", "$0.00"],
  ["ROAS", "0.00"],
  ["Revenue", "$0.00"],
  ["Lead Magnets", "0"],
];

export default function MarketingKPIs() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Marketing
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Marketing KPI Dashboard
        </h1>
        <p className="mt-3 text-gray-400">
          Track all key marketing performance indicators in one place.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-5 mb-10">
        {cards.map(([t, v]) => (
          <div key={t} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-slate-400 text-sm">{t}</p>
            <h2 className="mt-3 text-3xl font-bold">{v}</h2>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
        <h2 className="font-bold mb-5">KPI Benchmarks</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase border-b border-white/10">
                <th className="text-left pb-3">Metric</th>
                <th className="text-right pb-3">Current</th>
                <th className="text-right pb-3">Target</th>
                <th className="text-right pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { metric: "Email Open Rate", current: "0%", target: "25%", status: "—" },
                { metric: "Click-Through Rate", current: "0%", target: "3%", status: "—" },
                { metric: "Conversion Rate", current: "0%", target: "2%", status: "—" },
                { metric: "CAC", current: "$0", target: "$15", status: "—" },
                { metric: "LTV:CAC Ratio", current: "0", target: "3:1", status: "—" },
                { metric: "ROAS", current: "0", target: "4.0", status: "—" },
              ].map((row) => (
                <tr key={row.metric}>
                  <td className="py-3 text-gray-200">{row.metric}</td>
                  <td className="py-3 text-right font-mono">{row.current}</td>
                  <td className="py-3 text-right text-gray-400">{row.target}</td>
                  <td className="py-3 text-right text-gray-500">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
}
