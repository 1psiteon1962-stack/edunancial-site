export default function ProviderManagement() {
  const panels = [
    { name: "Applications", desc: "Review and approve provider applications.", count: "0" },
    { name: "Compliance", desc: "Track licenses, certifications and compliance.", count: "0" },
    { name: "Billing", desc: "Manage provider billing and payouts.", count: "0" },
    { name: "Licenses", desc: "Verify professional licenses and credentials.", count: "0" },
    { name: "Insurance", desc: "Track E&O insurance and coverage.", count: "0" },
    { name: "AI Referrals", desc: "AI-powered client-provider matching.", count: "0" },
    { name: "Complaints", desc: "Log and resolve provider complaints.", count: "0" },
    { name: "Analytics", desc: "Provider performance and revenue metrics.", count: "0" },
    { name: "Executive Reports", desc: "Summary reports for marketplace leadership.", count: "0" },
  ];

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Commerce
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Professional Marketplace
        </h1>
        <p className="mt-3 text-gray-400">
          Manage providers, compliance, billing and referral operations.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {[
          { label: "Total Providers", value: "0" },
          { label: "Active Providers", value: "0" },
          { label: "Pending Applications", value: "0" },
          { label: "Marketplace Revenue", value: "$0.00" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-gray-400 text-sm">{label}</p>
            <h2 className="text-3xl font-black mt-2">{value}</h2>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {panels.map((panel) => (
          <div key={panel.name} className="rounded-2xl bg-[#101a2f] border border-white/10 p-5">
            <div className="flex items-start justify-between">
              <h2 className="font-bold">{panel.name}</h2>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold">{panel.count}</span>
            </div>
            <p className="mt-2 text-sm text-gray-400">{panel.desc}</p>
            <button className="mt-4 text-xs text-blue-400 hover:text-blue-300 font-semibold">
              Manage →
            </button>
          </div>
        ))}
      </div>

    </main>
  );
}
