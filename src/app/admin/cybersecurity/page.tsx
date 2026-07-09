const panels = [
  { name: "Encryption", desc: "AES-256 encryption for data at rest and in transit.", status: "Enabled" },
  { name: "Secrets Management", desc: "Secure storage for API keys and credentials.", status: "Active" },
  { name: "Malware Scanner", desc: "Scan uploaded files for malicious content.", status: "Active" },
  { name: "Secure Uploads", desc: "Validate and sanitize all user file uploads.", status: "Active" },
  { name: "Vulnerabilities", desc: "Track and remediate known security vulnerabilities.", status: "0 open" },
  { name: "Incidents", desc: "Security incident management and response log.", status: "0 open" },
  { name: "Security Headers", desc: "HTTP security headers configuration.", status: "Active" },
  { name: "Threat Intelligence", desc: "External threat feeds and IOC matching.", status: "Configured" },
  { name: "Security Metrics", desc: "MTTD, MTTR and other security KPIs.", status: "Active" },
  { name: "Compliance", desc: "GDPR, CCPA and regional compliance tracking.", status: "In Progress" },
];

const statusColor: Record<string, string> = {
  Enabled: "bg-green-500/10 text-green-400",
  Active: "bg-green-500/10 text-green-400",
  Configured: "bg-blue-500/10 text-blue-400",
  "In Progress": "bg-yellow-500/10 text-yellow-400",
  "0 open": "bg-green-500/10 text-green-400",
};

export default function CyberSecurityDashboard() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Security
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Cybersecurity Command Center
        </h1>
        <p className="mt-3 text-gray-400">
          Threat detection, vulnerability management, encryption and compliance.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {[
          { label: "Open Vulnerabilities", value: "0" },
          { label: "Open Incidents", value: "0" },
          { label: "Files Scanned (24h)", value: "0" },
          { label: "Compliance Score", value: "—" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-gray-400 text-sm">{label}</p>
            <h2 className="text-3xl font-black mt-2">{value}</h2>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {panels.map((panel) => (
          <div key={panel.name} className="rounded-2xl bg-[#101a2f] border border-white/10 p-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold">{panel.name}</h2>
              <p className="mt-1 text-sm text-gray-400">{panel.desc}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${statusColor[panel.status] ?? "bg-gray-500/10 text-gray-400"}`}>
              {panel.status}
            </span>
          </div>
        ))}
      </div>

    </main>
  );
}
