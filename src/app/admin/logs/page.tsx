import { generateDemoLogs } from "@/lib/logging";
import { type LogSeverity, type LogCategory } from "@/lib/logging";
import Link from "next/link";

export const metadata = { title: "Centralized Log Viewer" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SEVERITY_COLORS: Record<LogSeverity, string> = {
  debug:    "text-gray-400",
  info:     "text-blue-300",
  warning:  "text-amber-300",
  error:    "text-red-400",
  critical: "text-red-300 font-bold",
};

const SEVERITY_BG: Record<LogSeverity, string> = {
  debug:    "",
  info:     "",
  warning:  "bg-amber-950/20",
  error:    "bg-red-950/20",
  critical: "bg-red-950/40",
};

const CATEGORY_LABELS: Record<LogCategory, string> = {
  application:       "App",
  authentication:    "Auth",
  admin_action:      "Admin",
  security:          "Security",
  payment:           "Payment",
  background_process:"Worker",
  api_request:       "API",
  database:          "DB",
  infrastructure:    "Infra",
};

export default async function LogViewerPage() {
  const logs = generateDemoLogs(120);
  const categories = [...new Set(logs.map((l) => l.category))].sort() as LogCategory[];
  const services   = [...new Set(logs.map((l) => l.service))].sort();

  const severityCounts = logs.reduce((acc, l) => {
    acc[l.severity] = (acc[l.severity] ?? 0) + 1;
    return acc;
  }, {} as Record<LogSeverity, number>);

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-6 md:p-10">

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black md:text-5xl">Log Viewer</h1>
          <p className="mt-2 text-gray-400">Structured centralized logging · demo data</p>
        </div>
        <Link href="/admin/infrastructure" className="text-sm text-blue-400 hover:underline">← Infrastructure Dashboard</Link>
      </div>

      {/* Severity summary */}
      <section className="mt-6 flex flex-wrap gap-3" aria-label="Log severity summary">
        {(["critical","error","warning","info","debug"] as LogSeverity[]).map((sev) => (
          <div key={sev} className="rounded-xl border border-white/10 bg-[#101a2f] px-4 py-3 min-w-[100px]">
            <p className={`text-xl font-black ${SEVERITY_COLORS[sev]}`}>{severityCounts[sev] ?? 0}</p>
            <p className="text-xs text-gray-500 mt-0.5 capitalize">{sev}</p>
          </div>
        ))}
      </section>

      {/* Filter bar (static demo) */}
      <section className="mt-6 rounded-xl border border-white/10 bg-[#101a2f] p-4" aria-label="Log filters">
        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-semibold">Filter by Category / Service</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span key={cat} className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300 bg-white/5">
              {CATEGORY_LABELS[cat] ?? cat}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {services.map((svc) => (
            <span key={svc} className="rounded-full border border-blue-700/30 px-3 py-1 text-xs text-blue-300 bg-blue-900/10">
              {svc}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-600">
          Wire the <code className="text-blue-400">/api/monitoring/logs</code> endpoint for live server-side filtering.
        </p>
      </section>

      {/* Log table */}
      <section className="mt-6" aria-label="Log entries">
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-xs font-mono" aria-label="Log entries table">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-500">
                <th className="px-3 py-3 font-semibold min-w-[160px]">Timestamp</th>
                <th className="px-3 py-3 font-semibold w-[80px]">Sev</th>
                <th className="px-3 py-3 font-semibold w-[80px]">Category</th>
                <th className="px-3 py-3 font-semibold w-[140px]">Service</th>
                <th className="px-3 py-3 font-semibold">Message</th>
                <th className="px-3 py-3 font-semibold w-[110px]">Correlation ID</th>
                <th className="px-3 py-3 font-semibold w-[90px]">Actor</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((entry) => (
                <tr
                  key={entry.id}
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors ${SEVERITY_BG[entry.severity]}`}
                >
                  <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{entry.timestamp.replace("T", " ").slice(0, 19)}</td>
                  <td className={`px-3 py-2 font-bold uppercase ${SEVERITY_COLORS[entry.severity]}`}>{entry.severity.slice(0, 4)}</td>
                  <td className="px-3 py-2 text-gray-400">{CATEGORY_LABELS[entry.category] ?? entry.category}</td>
                  <td className="px-3 py-2 text-blue-300">{entry.service}</td>
                  <td className="px-3 py-2 text-gray-200 max-w-[400px] truncate" title={entry.message}>{entry.message}</td>
                  <td className="px-3 py-2 text-gray-600">{entry.correlationId ?? "—"}</td>
                  <td className="px-3 py-2 text-gray-500">{entry.actor?.role ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Schema documentation */}
      <section className="mt-8 rounded-2xl border border-blue-700/30 bg-blue-900/10 p-6" aria-label="Log schema">
        <h2 className="text-sm font-semibold text-blue-300 mb-3">Log Schema (LogEntry)</h2>
        <div className="grid gap-2 sm:grid-cols-2 text-xs text-gray-400">
          {[
            ["id",            "Unique entry ID"],
            ["timestamp",     "ISO-8601 timestamp"],
            ["severity",      "debug | info | warning | error | critical"],
            ["category",      "Domain classification"],
            ["service",       "Originating service/module"],
            ["message",       "Human-readable description"],
            ["correlationId", "Request/trace ID"],
            ["actor",         "Authenticated user context"],
            ["httpContext",   "HTTP method, path, status, duration"],
            ["error",         "Error name, message, code"],
            ["redacted",      "List of fields that were redacted"],
          ].map(([field, desc]) => (
            <div key={field} className="flex gap-2">
              <code className="text-blue-300 flex-shrink-0">{field}</code>
              <span className="text-gray-500">{desc}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-600">
          Retention policies are configured in <code className="text-blue-400">src/lib/logging/types.ts</code> (DEFAULT_RETENTION_POLICIES).
          Wire a production LogTransport to enforce them.
        </p>
      </section>

    </main>
  );
}
