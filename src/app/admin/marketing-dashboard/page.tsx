const cards = [
  ["Subscribers", "0"],
  ["CAC", "$0.00"],
  ["LTV", "$0.00"],
  ["Conversion Rate", "0%"],
  ["Revenue", "$0.00"],
  ["Email Open Rate", "0%"],
  ["Click Rate", "0%"],
  ["Lead Magnets", "0"],
];

const channels = [
  { channel: "Organic Search", leads: 0, conversions: 0, revenue: "$0" },
  { channel: "Email Marketing", leads: 0, conversions: 0, revenue: "$0" },
  { channel: "Social Media", leads: 0, conversions: 0, revenue: "$0" },
  { channel: "Referral", leads: 0, conversions: 0, revenue: "$0" },
  { channel: "Paid Ads", leads: 0, conversions: 0, revenue: "$0" },
];

export default function MarketingDashboard() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Marketing
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Marketing Dashboard
        </h1>
        <p className="mt-3 text-gray-400">
          Subscriber growth, acquisition costs and campaign performance.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {cards.map(([title, value]) => (
          <div key={title} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-slate-400 text-sm">{title}</p>
            <h2 className="mt-3 text-3xl font-bold">{value}</h2>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#101a2f] border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="font-bold">Acquisition by Channel</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr>
                {["Channel", "Leads", "Conversions", "Revenue"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-400 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {channels.map((c) => (
                <tr key={c.channel} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-semibold">{c.channel}</td>
                  <td className="px-6 py-4 text-gray-400">{c.leads}</td>
                  <td className="px-6 py-4 text-gray-400">{c.conversions}</td>
                  <td className="px-6 py-4 font-mono text-gray-300">{c.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
}
