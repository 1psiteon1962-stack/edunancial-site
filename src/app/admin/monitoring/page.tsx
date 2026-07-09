import { getMetricsProvider } from "@/lib/monitoring";
import MetricCard from "@/components/monitoring/MetricCard";
import StatusBadge from "@/components/monitoring/StatusBadge";
import Link from "next/link";

export const metadata = { title: "Application Monitoring" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MonitoringPage() {
  const [snapshot, events] = await Promise.all([
    getMetricsProvider().fetchSnapshot(),
    getMetricsProvider().fetchObservabilityEvents(Date.now() - 3_600_000, Date.now()),
  ]);

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-6 md:p-10">

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-black md:text-5xl">Application Monitoring</h1>
          <p className="mt-2 text-gray-400">Performance, traces, and observability · last 1h</p>
        </div>
        <Link href="/admin/infrastructure" className="text-sm text-blue-400 hover:underline">← Infrastructure Dashboard</Link>
      </div>

      {/* API Endpoints */}
      <section className="mt-8" aria-label="API performance metrics">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">API Endpoint Performance</h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400">
                {["Endpoint", "Method", "Req/min", "Avg Latency", "P95", "P99", "Error Rate"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {snapshot.apis.map((api) => (
                <tr key={`${api.method}-${api.endpoint}`} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-200">{api.endpoint}</td>
                  <td className="px-4 py-3 text-xs font-bold text-blue-300">{api.method}</td>
                  <td className="px-4 py-3 text-gray-300">{api.requestsPerMinute.toFixed(0)}</td>
                  <td className={`px-4 py-3 font-semibold ${api.avgLatencyMs > 200 ? "text-amber-400" : "text-emerald-400"}`}>{api.avgLatencyMs.toFixed(0)} ms</td>
                  <td className={`px-4 py-3 ${api.p95LatencyMs > 500 ? "text-amber-400" : "text-gray-300"}`}>{api.p95LatencyMs.toFixed(0)} ms</td>
                  <td className={`px-4 py-3 ${api.p99LatencyMs > 1000 ? "text-red-400" : "text-gray-300"}`}>{api.p99LatencyMs.toFixed(0)} ms</td>
                  <td className={`px-4 py-3 font-semibold ${api.errorRate > 0.05 ? "text-red-400" : api.errorRate > 0.01 ? "text-amber-400" : "text-emerald-400"}`}>
                    {(api.errorRate * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Database metrics */}
      <section className="mt-8" aria-label="Database performance">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Database Performance</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {snapshot.databases.map((db) => (
            <div key={db.databaseId} className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-white text-sm">{db.databaseId}</p>
                <StatusBadge status={db.errorRate > 0.05 ? "down" : db.slowQueryCount > 5 ? "degraded" : "healthy"} size="sm" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><p className="text-gray-500">Avg Query</p><p className={`font-bold ${db.queryLatencyMs > 100 ? "text-amber-400" : "text-emerald-400"}`}>{db.queryLatencyMs.toFixed(1)} ms</p></div>
                <div><p className="text-gray-500">Slow Queries</p><p className={`font-bold ${db.slowQueryCount > 0 ? "text-amber-400" : "text-emerald-400"}`}>{db.slowQueryCount}</p></div>
                <div><p className="text-gray-500">Pool Used</p><p className="font-bold text-white">{db.connectionPoolUsed}/{db.connectionPoolMax}</p></div>
                <div><p className="text-gray-500">Replication Lag</p><p className={`font-bold ${(db.replicationLagMs ?? 0) > 100 ? "text-amber-400" : "text-gray-300"}`}>{db.replicationLagMs != null ? `${db.replicationLagMs.toFixed(0)} ms` : "—"}</p></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Queue health */}
      <section className="mt-8" aria-label="Queue health">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Queue Health</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {snapshot.queues.map((q) => (
            <div key={q.queueName} className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-white text-sm">{q.queueName}</p>
                <StatusBadge status={q.failedJobCount > 5 ? "degraded" : q.depth > 1000 ? "degraded" : "healthy"} size="sm" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><p className="text-gray-500">Depth</p><p className={`font-bold ${q.depth > 500 ? "text-amber-400" : "text-white"}`}>{q.depth}</p></div>
                <div><p className="text-gray-500">Consumers</p><p className="font-bold text-white">{q.consumerCount}</p></div>
                <div><p className="text-gray-500">Rate/sec</p><p className="font-bold text-emerald-400">{q.processingRatePerSecond.toFixed(1)}</p></div>
                <div><p className="text-gray-500">Failed Jobs</p><p className={`font-bold ${q.failedJobCount > 0 ? "text-red-400" : "text-emerald-400"}`}>{q.failedJobCount}</p></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Observability events */}
      <section className="mt-8" aria-label="Observability events">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Recent Observability Events</h2>
        {events.length === 0 ? (
          <p className="text-gray-500 text-sm">No events in the last hour.</p>
        ) : (
          <div className="space-y-3">
            {events.map((evt) => {
              const severityColors: Record<string, string> = {
                critical: "border-red-600 bg-red-900/10",
                error: "border-red-700/60 bg-red-900/10",
                warning: "border-amber-600 bg-amber-900/10",
                info: "border-blue-700/60 bg-blue-900/10",
              };
              const color = severityColors[evt.severity] ?? "border-white/10 bg-[#101a2f]";
              return (
                <div key={evt.id} className={`rounded-xl border-l-4 ${color} p-4`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase text-gray-400 mr-2">{evt.type}</span>
                      <span className="text-sm text-white">{evt.message}</span>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {evt.service}{evt.durationMs != null ? ` · ${evt.durationMs}ms` : ""}{evt.traceId ? ` · trace: ${evt.traceId}` : ""}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Integration readiness notice */}
      <section className="mt-8 rounded-2xl border border-blue-700/30 bg-blue-900/10 p-6" aria-label="Integration readiness">
        <h2 className="text-sm font-semibold text-blue-300 mb-2">Integration Points</h2>
        <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
          <li>Error tracking — wire a <code className="text-blue-300">MetricsProvider</code> implementation for Sentry, Datadog, or New Relic</li>
          <li>Distributed tracing — implement <code className="text-blue-300">fetchTrace()</code> on your provider for OpenTelemetry/Zipkin</li>
          <li>Slow query detection — set threshold in <code className="text-blue-300">src/lib/alerting/rules.ts</code> and connect to your DB query logger</li>
          <li>APM — replace <code className="text-blue-300">DemoMetricsProvider</code> with your APM vendor adapter</li>
        </ul>
      </section>

    </main>
  );
}
