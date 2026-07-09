const cards = [
  ["Global Revenue", "$0"],
  ["Global Profit", "$0"],
  ["Global Customers", "0"],
  ["Subscribers", "0"],
  ["Best Region", "--"],
  ["Best Country", "--"],
  ["Best Product", "--"],
  ["Highest LTV", "--"],
  ["Lowest CAC", "--"],
  ["Executive Alerts", "0"],
  ["System Health", "Healthy"],
  ["Platform Status", "Online"],
];

const alerts = [
  { level: "Info", message: "Platform initialized successfully.", time: "Now" },
  { level: "Info", message: "Admin console accessed.", time: "Now" },
];

const alertColor: Record<string, string> = {
  Info: "bg-blue-500/10 text-blue-400",
  Warning: "bg-yellow-500/10 text-yellow-400",
  Critical: "bg-red-500/10 text-red-400",
};

export default function ExecutiveCommandCenter() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Executive
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Executive Command Center
        </h1>
        <p className="mt-3 text-gray-400">
          Real-time global intelligence and executive controls.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {cards.map(([title, value]) => (
          <div key={title} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-slate-400 text-sm">{title}</p>
            <h2 className="mt-3 text-2xl font-bold">{value}</h2>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <h2 className="font-bold mb-5">Executive Alerts</h2>
          {alerts.length === 0 ? (
            <p className="text-gray-400 text-sm">No active alerts.</p>
          ) : (
            <ul className="space-y-3">
              {alerts.map((alert, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold shrink-0 ${alertColor[alert.level]}`}>
                    {alert.level}
                  </span>
                  <div>
                    <p className="text-sm text-gray-200">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <h2 className="font-bold mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Export Report", color: "bg-blue-600" },
              { label: "Send Alert", color: "bg-red-600" },
              { label: "Refresh KPIs", color: "bg-green-600" },
              { label: "Backup Data", color: "bg-purple-600" },
            ].map((action) => (
              <button
                key={action.label}
                className={`${action.color} rounded-xl px-4 py-3 text-sm font-bold hover:opacity-90 transition-opacity`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

      </div>

    </main>
  );
}
