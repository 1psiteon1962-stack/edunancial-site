const stats = [
  { label: "Threat Level", value: "Low", color: "text-green-400" },
  { label: "Failed Logins (24h)", value: "0", color: "text-white" },
  { label: "Blocked IPs", value: "0", color: "text-white" },
  { label: "Security Score", value: "—", color: "text-white" },
];

const services = [
  { name: "Database", status: "Healthy", color: "bg-green-400" },
  { name: "API Gateway", status: "Operational", color: "bg-green-400" },
  { name: "Auth Service", status: "Operational", color: "bg-green-400" },
  { name: "File Storage", status: "Operational", color: "bg-green-400" },
  { name: "Backups", status: "Active", color: "bg-green-400" },
  { name: "Firewall", status: "Active", color: "bg-green-400" },
  { name: "CDN", status: "Active", color: "bg-green-400" },
  { name: "Monitoring", status: "Active", color: "bg-green-400" },
];

const auditLog = [
  { action: "Admin login", user: "system", time: "Just now", ip: "—" },
  { action: "Platform initialized", user: "system", time: "Just now", ip: "—" },
];

export default function SecurityDashboard() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Security
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Security Operations Center
        </h1>
        <p className="mt-3 text-gray-400">
          Real-time threat monitoring, system health and access controls.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-gray-400 text-sm">{label}</p>
            <h2 className={`text-3xl font-black mt-3 ${color}`}>{value}</h2>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">

        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <h2 className="font-bold mb-5">System Health</h2>
          <ul className="space-y-3">
            {services.map(({ name, status, color }) => (
              <li key={name} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{name}</span>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${color}`} />
                  <span className="text-sm font-semibold">{status}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <h2 className="font-bold mb-5">Recent Audit Log</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase border-b border-white/10">
                <th className="text-left pb-3">Action</th>
                <th className="text-left pb-3">User</th>
                <th className="text-left pb-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {auditLog.map((log, i) => (
                <tr key={i}>
                  <td className="py-3 text-gray-200">{log.action}</td>
                  <td className="py-3 text-gray-400">{log.user}</td>
                  <td className="py-3 text-gray-400">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {[
          { label: "View Blocked IPs", color: "bg-red-600" },
          { label: "Security Policies", color: "bg-blue-600" },
          { label: "Export Audit Log", color: "bg-gray-700" },
          { label: "Run Security Scan", color: "bg-purple-600" },
        ].map(({ label, color }) => (
          <button key={label} className={`${color} rounded-xl px-4 py-3 text-sm font-bold hover:opacity-90 transition-opacity`}>
            {label}
          </button>
        ))}
      </div>

    </main>
  );
}
