import Link from "next/link";
import { MODERATION_REPORTS } from "@/data/community";

export const metadata = {
  title: "Report Review | Admin | Edunancial",
};

const REASON_LABELS: Record<string, string> = {
  spam: "Spam",
  harassment: "Harassment",
  misinformation: "Misinformation",
  inappropriate: "Inappropriate Content",
  "off-topic": "Off Topic",
  other: "Other",
};

const REASON_COLORS: Record<string, string> = {
  spam: "bg-orange-500/20 text-orange-400",
  harassment: "bg-red-500/20 text-red-400",
  misinformation: "bg-yellow-500/20 text-yellow-400",
  inappropriate: "bg-pink-500/20 text-pink-400",
  "off-topic": "bg-slate-500/20 text-slate-300",
  other: "bg-blue-500/20 text-blue-400",
};

export default function AdminReportsPage() {
  const openReports = MODERATION_REPORTS.filter((r) => r.status === "open");
  const resolvedReports = MODERATION_REPORTS.filter((r) => r.status !== "open");

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-10">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-400">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/admin" className="hover:text-yellow-400 transition-colors">
              Admin
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link href="/admin/community" className="hover:text-yellow-400 transition-colors">
              Community
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="text-slate-200" aria-current="page">Reports</li>
        </ol>
      </nav>

      <h1 className="text-5xl font-black">Report Review</h1>
      <p className="mt-4 text-xl text-slate-300">
        Review reported content and take appropriate moderation actions.
      </p>

      <div className="mt-8 flex gap-6 text-sm text-slate-400">
        <span>
          <strong className="text-red-400 text-lg">{openReports.length}</strong>{" "}
          open
        </span>
        <span>
          <strong className="text-green-400 text-lg">{resolvedReports.length}</strong>{" "}
          resolved
        </span>
        <span>
          <strong className="text-white text-lg">{MODERATION_REPORTS.length}</strong>{" "}
          total
        </span>
      </div>

      {/* Open Reports */}
      <section className="mt-12" aria-labelledby="open-reports-heading">
        <h2 id="open-reports-heading" className="text-2xl font-black mb-6">
          🚩 Open Reports
        </h2>

        {openReports.length === 0 ? (
          <div className="rounded-xl bg-slate-800 p-12 text-center text-slate-400">
            No open reports. Community is clean! ✅
          </div>
        ) : (
          <div className="space-y-6">
            {openReports.map((report) => (
              <div
                key={report.id}
                className="rounded-xl bg-slate-800 border border-red-500/20 p-8"
                role="article"
                aria-label={`Report: ${report.targetTitle ?? report.targetId}`}
              >
                <div className="flex flex-wrap justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-300 capitalize">
                        {report.targetType}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          REASON_COLORS[report.reason] ?? "bg-slate-600 text-slate-300"
                        }`}
                      >
                        {REASON_LABELS[report.reason] ?? report.reason}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-lg">
                      {report.targetTitle ?? `Content #${report.targetId}`}
                    </h3>

                    {report.details && (
                      <blockquote className="mt-3 border-l-4 border-slate-600 pl-4 text-sm text-slate-300 italic">
                        &ldquo;{report.details}&rdquo;
                      </blockquote>
                    )}

                    <div className="mt-4 text-sm text-slate-500">
                      Reported by{" "}
                      <span className="text-slate-300 font-semibold">
                        {report.reporter.displayName}
                      </span>{" "}
                      on{" "}
                      <time dateTime={report.createdAt}>
                        {new Date(report.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <p className="text-sm font-semibold text-slate-400 mb-4">
                    Moderation Actions:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-600 transition-colors"
                      aria-label="Approve content — mark report as resolved"
                    >
                      ✅ Approve Content
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-red-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-600 transition-colors"
                      aria-label="Remove content"
                    >
                      🗑️ Remove Content
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-yellow-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-yellow-600 transition-colors"
                      aria-label="Issue warning to author"
                    >
                      ⚠️ Warn Author
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-orange-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
                      aria-label="Temporarily suspend author"
                    >
                      ⏸️ Suspend User
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-slate-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-600 transition-colors"
                      aria-label="Dismiss this report"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Resolved Reports */}
      {resolvedReports.length > 0 && (
        <section className="mt-16" aria-labelledby="resolved-heading">
          <h2 id="resolved-heading" className="text-2xl font-black mb-6">
            ✅ Resolved Reports
          </h2>
          <div className="rounded-xl bg-slate-800 overflow-hidden">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-slate-700">
                  <th scope="col" className="px-6 py-4 text-left font-semibold text-slate-400">
                    Content
                  </th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold text-slate-400">
                    Reason
                  </th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold text-slate-400">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold text-slate-400">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {resolvedReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-300 max-w-xs truncate">
                      {report.targetTitle ?? `Content #${report.targetId}`}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          REASON_COLORS[report.reason] ?? "bg-slate-600 text-slate-300"
                        }`}
                      >
                        {REASON_LABELS[report.reason] ?? report.reason}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-green-500/20 text-green-400 px-2 py-0.5 text-xs font-semibold capitalize">
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <time dateTime={report.createdAt}>
                        {new Date(report.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

    </main>
  );
}
