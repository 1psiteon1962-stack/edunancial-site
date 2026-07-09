import { getDemoAlerts, getDemoAlertSummary } from "@/lib/alerting";
import { getMetricsProvider } from "@/lib/monitoring";
import { getDemoSummary } from "@/lib/backup";
import MetricCard from "@/components/monitoring/MetricCard";
import StatusBadge from "@/components/monitoring/StatusBadge";
import ServiceHealthGrid from "@/components/monitoring/ServiceHealthGrid";
import AlertsPanel from "@/components/monitoring/AlertsPanel";
import Link from "next/link";

export const metadata = {
  title: "Infrastructure Dashboard",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatBytes(bytes: number): string {
  if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(1)} TB`;
  if (bytes >= 1e9)  return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6)  return `${(bytes / 1e6).toFixed(1)} MB`;
  return `${bytes} B`;
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return `${days}d ${hours}h`;
}

export default async function InfrastructureDashboard() {
  const [snapshot, backupSummary, alertSummary, alerts] = await Promise.all([
    getMetricsProvider().fetchSnapshot(),
    getDemoSummary(),
    getDemoAlertSummary(),
    getDemoAlerts(),
  ]);

  const avgCpu    = snapshot.servers.reduce((a, s) => a + s.cpuPercent,    0) / snapshot.servers.length;
  const avgMem    = snapshot.servers.reduce((a, s) => a + s.memoryPercent, 0) / snapshot.servers.length;
  const avgDisk   = snapshot.servers.reduce((a, s) => a + s.diskPercent,   0) / snapshot.servers.length;
  const avgUptime = snapshot.servers.reduce((a, s) => a + s.uptimeSeconds, 0) / snapshot.servers.length;

  const quickLinks = [
    { label: "Monitoring",       href: "/admin/monitoring"       },
    { label: "Logs",             href: "/admin/logs"             },
    { label: "Backups",          href: "/admin/backups"          },
    { label: "Disaster Recovery",href: "/admin/disaster-recovery"},
    { label: "Alerts",           href: "/admin/alerts"           },
  ];

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-6 md:p-10">

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black md:text-5xl">Infrastructure Dashboard</h1>
          <p className="mt-2 text-gray-400">Real-time operational overview · {new Date().toUTCString()}</p>
        </div>
        <StatusBadge status={snapshot.overallStatus} />
      </div>

      {/* Quick nav */}
      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Infrastructure sections">
        {quickLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-lg border border-white/10 bg-[#101a2f] px-4 py-2 text-sm font-medium text-gray-300 hover:border-white/30 hover:text-white transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Summary metrics */}
      <section className="mt-8" aria-label="Summary metrics">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Resource Utilization
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Avg CPU Usage"    value={avgCpu.toFixed(1)}    unit="%" status={avgCpu    > 80 ? "critical" : avgCpu    > 60 ? "warn" : "good"} />
          <MetricCard title="Avg Memory Usage" value={avgMem.toFixed(1)}    unit="%" status={avgMem    > 85 ? "critical" : avgMem    > 70 ? "warn" : "good"} />
          <MetricCard title="Avg Disk Usage"   value={avgDisk.toFixed(1)}   unit="%" status={avgDisk   > 85 ? "critical" : avgDisk   > 70 ? "warn" : "good"} />
          <MetricCard title="Avg Server Uptime" value={formatUptime(avgUptime)} status="good" description="Across all nodes" />
        </div>
      </section>

      {/* Alerts summary */}
      <section className="mt-8" aria-label="Alert summary">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Alert Status</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Firing Alerts"   value={alertSummary.firing}   status={alertSummary.firing   > 0 ? "critical" : "good"} />
          <MetricCard title="Critical"        value={alertSummary.critical} status={alertSummary.critical > 0 ? "critical" : "good"} />
          <MetricCard title="High Severity"   value={alertSummary.high}     status={alertSummary.high     > 0 ? "warn"     : "good"} />
          <MetricCard title="Total (24h)"     value={alertSummary.total}    status="neutral" />
        </div>
      </section>

      {/* Service health */}
      <section className="mt-8" aria-label="Service health">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Service Health</h2>
        <ServiceHealthGrid services={snapshot.services} />
      </section>

      {/* Server grid */}
      <section className="mt-8" aria-label="Server metrics">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Servers</h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400">
                {["Hostname", "CPU %", "Memory %", "Disk %", "Network Latency", "Uptime"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {snapshot.servers.map((srv) => (
                <tr key={srv.serverId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-300">{srv.hostname}</td>
                  <td className={`px-4 py-3 font-semibold ${srv.cpuPercent > 80 ? "text-red-400" : srv.cpuPercent > 60 ? "text-amber-400" : "text-emerald-400"}`}>{srv.cpuPercent.toFixed(1)}%</td>
                  <td className={`px-4 py-3 font-semibold ${srv.memoryPercent > 85 ? "text-red-400" : srv.memoryPercent > 70 ? "text-amber-400" : "text-emerald-400"}`}>{srv.memoryPercent.toFixed(1)}%</td>
                  <td className={`px-4 py-3 font-semibold ${srv.diskPercent > 85 ? "text-red-400" : srv.diskPercent > 70 ? "text-amber-400" : "text-emerald-400"}`}>{srv.diskPercent.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-gray-300">{srv.networkLatencyMs.toFixed(1)} ms</td>
                  <td className="px-4 py-3 text-gray-300">{formatUptime(srv.uptimeSeconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Alerts + Backup row */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <AlertsPanel alerts={alerts} maxItems={6} />
          <div className="mt-4">
            <Link href="/admin/alerts" className="text-sm text-blue-400 hover:underline">
              View all alerts →
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Backup Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Total Backups</p>
              <p className="text-2xl font-black text-white">{backupSummary.totalBackups}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Verified</p>
              <p className="text-2xl font-black text-emerald-400">{backupSummary.verifiedCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Failed</p>
              <p className={`text-2xl font-black ${backupSummary.failedCount > 0 ? "text-red-400" : "text-emerald-400"}`}>{backupSummary.failedCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Storage Used</p>
              <p className="text-2xl font-black text-white">{formatBytes(backupSummary.totalStorageBytes)}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/backups" className="text-sm text-blue-400 hover:underline">
              Manage backups →
            </Link>
          </div>
        </div>
      </div>

      {/* Background jobs */}
      <section className="mt-8" aria-label="Background jobs">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Background Jobs</h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400">
                {["Job Name", "Last Run", "Duration", "Status", "Success Rate", "Next Run"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {snapshot.backgroundJobs.map((job) => (
                <tr key={job.jobName} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{job.jobName}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(job.lastRunAt).toLocaleTimeString()}</td>
                  <td className="px-4 py-3 text-gray-300">{(job.lastRunDurationMs / 1000).toFixed(1)}s</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={job.lastRunStatus === "success" ? "healthy" : job.lastRunStatus === "failed" ? "down" : "degraded"}
                      label={job.lastRunStatus}
                      size="sm"
                    />
                  </td>
                  <td className={`px-4 py-3 font-semibold ${job.successRate < 0.95 ? "text-amber-400" : "text-emerald-400"}`}>
                    {(job.successRate * 100).toFixed(0)}%
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {job.nextScheduledAt ? new Date(job.nextScheduledAt).toLocaleTimeString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </main>
  );
}
