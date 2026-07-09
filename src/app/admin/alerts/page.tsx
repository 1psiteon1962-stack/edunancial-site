import { getDemoAlerts, getDemoAlertSummary, DEFAULT_ALERT_RULES, DEFAULT_CHANNELS } from "@/lib/alerting";
import { type AlertSeverity } from "@/lib/alerting";
import StatusBadge from "@/components/monitoring/StatusBadge";
import AlertsPanel from "@/components/monitoring/AlertsPanel";
import Link from "next/link";

export const metadata = { title: "Alerts Management" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SEVERITY_COLORS: Record<AlertSeverity, string> = {
  critical: "text-red-400",
  high:     "text-amber-400",
  medium:   "text-yellow-400",
  low:      "text-blue-400",
  info:     "text-gray-400",
};

function relativeTime(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60)    return `${seconds}s ago`;
  if (seconds < 3600)  return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function AlertsPage() {
  const alerts  = getDemoAlerts();
  const summary = getDemoAlertSummary();

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-6 md:p-10">

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black md:text-5xl">Alerts</h1>
          <p className="mt-2 text-gray-400">Configurable alerting rules, notification channels, and alert routing</p>
        </div>
        <Link href="/admin/infrastructure" className="text-sm text-blue-400 hover:underline">← Infrastructure Dashboard</Link>
      </div>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Alert summary">
        <div className={`rounded-2xl border p-6 ${summary.firing > 0 ? "border-red-700/40 bg-red-900/10" : "border-white/10 bg-[#101a2f]"}`}>
          <p className="text-sm text-gray-400">Currently Firing</p>
          <p className={`mt-2 text-3xl font-black ${summary.firing > 0 ? "text-red-400" : "text-emerald-400"}`}>{summary.firing}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <p className="text-sm text-gray-400">Critical Firing</p>
          <p className={`mt-2 text-3xl font-black ${summary.critical > 0 ? "text-red-400" : "text-emerald-400"}`}>{summary.critical}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <p className="text-sm text-gray-400">High Firing</p>
          <p className={`mt-2 text-3xl font-black ${summary.high > 0 ? "text-amber-400" : "text-emerald-400"}`}>{summary.high}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <p className="text-sm text-gray-400">Total (All Time)</p>
          <p className="mt-2 text-3xl font-black text-white">{summary.total}</p>
        </div>
      </section>

      {/* Recent alerts panel */}
      <section className="mt-8 rounded-2xl border border-white/10 bg-[#101a2f] p-6" aria-label="Recent alerts">
        <AlertsPanel alerts={alerts} title="All Alerts" maxItems={20} />
      </section>

      {/* Alert history table */}
      <section className="mt-8" aria-label="Alert history">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Alert History</h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400">
                {["Rule", "Severity", "Service", "Message", "Fired", "Resolved", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{alert.ruleName}</td>
                  <td className={`px-4 py-3 font-semibold capitalize ${SEVERITY_COLORS[alert.severity]}`}>{alert.severity}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{alert.service}</td>
                  <td className="px-4 py-3 text-gray-300 text-xs max-w-[300px] truncate" title={alert.message}>{alert.message}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{relativeTime(alert.firedAt)}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{alert.resolvedAt ? relativeTime(alert.resolvedAt) : "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={alert.status as "firing" | "resolved" | "acknowledged"}
                      size="sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Alert rules */}
      <section className="mt-8" aria-label="Alert rules configuration">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Alert Rules</h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400">
                {["Name", "Category", "Severity", "Threshold", "Duration", "Channels", "Enabled"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEFAULT_ALERT_RULES.map((rule) => (
                <tr key={rule.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{rule.name}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{rule.category.replace(/_/g, " ")}</td>
                  <td className={`px-4 py-3 font-semibold capitalize ${SEVERITY_COLORS[rule.severity]}`}>{rule.severity}</td>
                  <td className="px-4 py-3 text-gray-300 text-xs">{rule.threshold} {rule.unit}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{rule.durationSeconds}s</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{rule.channels.join(", ")}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${rule.enabled ? "text-emerald-400" : "text-gray-600"}`}>
                      {rule.enabled ? "✓ Active" : "Disabled"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Notification channels */}
      <section className="mt-8" aria-label="Notification channels">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Notification Channels</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DEFAULT_CHANNELS.map((ch) => (
            <div key={ch.id} className="rounded-xl border border-white/10 bg-[#101a2f] p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{ch.name}</p>
                <p className="text-xs text-gray-500 mt-0.5 capitalize">{ch.type}</p>
              </div>
              <StatusBadge status={ch.enabled ? "healthy" : "unknown"} label={ch.enabled ? "Active" : "Inactive"} size="sm" />
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-600">
          Add production channel credentials in <code className="text-blue-400">src/lib/alerting/rules.ts</code> by implementing <code className="text-blue-400">NotificationChannel</code>.
        </p>
      </section>

    </main>
  );
}
