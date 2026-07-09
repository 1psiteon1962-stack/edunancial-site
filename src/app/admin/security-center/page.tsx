const widgets = [
  { name: "Threat Monitor", desc: "Real-time threat detection and alerting.", status: "Active" },
  { name: "Intrusion Detection", desc: "Monitor for unauthorized access attempts.", status: "Active" },
  { name: "Audit Logs", desc: "Complete record of all admin and user actions.", status: "Active" },
  { name: "Backups", desc: "Automated database and file backups.", status: "Active" },
  { name: "Disaster Recovery", desc: "Recovery procedures and failover plans.", status: "Configured" },
  { name: "API Keys", desc: "Manage and rotate API credentials.", status: "Active" },
  { name: "Security Policies", desc: "Access control and password policies.", status: "Active" },
  { name: "File Integrity", desc: "Monitor file changes and checksums.", status: "Active" },
  { name: "Security Score", desc: "Overall platform security posture rating.", status: "—" },
  { name: "System Health", desc: "All services operational status.", status: "Healthy" },
];

const statusColor: Record<string, string> = {
  Active: "bg-green-500/10 text-green-400",
  Healthy: "bg-green-500/10 text-green-400",
  Configured: "bg-blue-500/10 text-blue-400",
  "—": "bg-gray-500/10 text-gray-400",
};

export default function SecurityCenter() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Security
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Enterprise Security Center
        </h1>
        <p className="mt-3 text-gray-400">
          Comprehensive security management, compliance and incident response.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {[
          { label: "Security Score", value: "—" },
          { label: "Open Incidents", value: "0" },
          { label: "Policies Active", value: "0" },
          { label: "Last Backup", value: "—" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-gray-400 text-sm">{label}</p>
            <h2 className="text-3xl font-black mt-2">{value}</h2>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {widgets.map((widget) => (
          <div key={widget.name} className="rounded-2xl bg-[#101a2f] border border-white/10 p-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold">{widget.name}</h2>
              <p className="mt-1 text-sm text-gray-400">{widget.desc}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${statusColor[widget.status] ?? "bg-gray-500/10 text-gray-400"}`}>
              {widget.status}
            </span>
          </div>
        ))}
      </div>

    </main>
  );
}
