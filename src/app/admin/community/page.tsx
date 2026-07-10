import Link from "next/link";
import {
  MODERATION_REPORTS,
  AUDIT_LOGS,
  COMMUNITY_STATS,
  DISCUSSIONS,
  COMMUNITY_MEMBERS,
} from "@/data/community";

export const metadata = {
  title: "Community Moderation | Admin | Edunancial",
};

export default function AdminCommunityPage() {
  const openReports = MODERATION_REPORTS.filter((r) => r.status === "open");
  const recentLogs = AUDIT_LOGS.slice(0, 5);

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
          <li className="text-slate-200" aria-current="page">Community Moderation</li>
        </ol>
      </nav>

      <h1 className="text-5xl font-black">Community Moderation</h1>
      <p className="mt-4 text-xl text-slate-300">
        Review reports, manage content, and maintain community standards.
      </p>

      {/* Stats */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Open Reports",
            value: openReports.length,
            color: "bg-red-700",
            href: "/admin/community/reports",
          },
          {
            label: "Total Members",
            value: COMMUNITY_STATS.totalMembers.toLocaleString(),
            color: "bg-blue-700",
            href: "/admin/community/users",
          },
          {
            label: "Total Discussions",
            value: COMMUNITY_STATS.totalDiscussions.toLocaleString(),
            color: "bg-green-700",
            href: "/community/forum",
          },
          {
            label: "Active Today",
            value: COMMUNITY_STATS.activeToday.toLocaleString(),
            color: "bg-yellow-700",
            href: "/admin/community",
          },
        ].map(({ label, value, color, href }) => (
          <Link
            key={label}
            href={href}
            className={`rounded-2xl ${color} p-8 text-center hover:opacity-90 transition-opacity`}
          >
            <p className="text-sm uppercase tracking-wider text-white/70">
              {label}
            </p>
            <p className="mt-3 text-4xl font-black">{value}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <section className="mt-12" aria-labelledby="actions-heading">
        <h2 id="actions-heading" className="text-2xl font-black mb-6">
          Moderation Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Review Reports",
              description: `${openReports.length} open report${openReports.length !== 1 ? "s" : ""} awaiting review`,
              icon: "🚩",
              href: "/admin/community/reports",
              urgent: openReports.length > 0,
            },
            {
              title: "User Management",
              description: "Issue warnings, suspensions, and bans",
              icon: "👤",
              href: "/admin/community/users",
              urgent: false,
            },
            {
              title: "Browse All Discussions",
              description: "Review, approve, or remove content",
              icon: "💬",
              href: "/community/forum",
              urgent: false,
            },
            {
              title: "Pinned & Featured",
              description: "Manage featured topics and staff picks",
              icon: "📌",
              href: "/community/forum",
              urgent: false,
            },
            {
              title: "Audit Log",
              description: "Full history of moderation actions",
              icon: "📋",
              href: "/admin/community",
              urgent: false,
            },
            {
              title: "Community Settings",
              description: "Configure forum rules and permissions",
              icon: "⚙️",
              href: "/admin/community",
              urgent: false,
            },
          ].map(({ title, description, icon, href, urgent }) => (
            <Link
              key={title}
              href={href}
              className={`rounded-xl bg-slate-800 p-6 hover:bg-slate-700 transition-colors border ${
                urgent ? "border-red-500/50" : "border-transparent"
              }`}
            >
              <div className="text-3xl mb-3" aria-hidden="true">
                {icon}
              </div>
              <h3 className="font-bold text-white text-lg">{title}</h3>
              <p className="mt-1 text-sm text-slate-400">{description}</p>
              {urgent && (
                <span className="mt-3 inline-block rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-400">
                  Needs Attention
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Open reports preview */}
      {openReports.length > 0 && (
        <section className="mt-12" aria-labelledby="reports-heading">
          <div className="flex items-center justify-between mb-6">
            <h2 id="reports-heading" className="text-2xl font-black">
              🚩 Open Reports
            </h2>
            <Link
              href="/admin/community/reports"
              className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {openReports.map((report) => (
              <div
                key={report.id}
                className="rounded-xl bg-slate-800 border border-red-500/20 p-6"
              >
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">
                      {report.targetTitle ?? `${report.targetType} #${report.targetId}`}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Reported for:{" "}
                      <span className="text-red-400 font-semibold capitalize">
                        {report.reason}
                      </span>
                    </p>
                    {report.details && (
                      <p className="mt-1 text-sm text-slate-500">
                        &ldquo;{report.details}&rdquo;
                      </p>
                    )}
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    <p>
                      Reported by{" "}
                      <span className="text-slate-300">
                        {report.reporter.displayName}
                      </span>
                    </p>
                    <time dateTime={report.createdAt}>
                      {new Date(report.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/admin/community/reports"
                    className="rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-600 transition-colors"
                  >
                    Review
                  </Link>
                  <button
                    type="button"
                    className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-600 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Audit log preview */}
      <section className="mt-12" aria-labelledby="audit-heading">
        <h2 id="audit-heading" className="text-2xl font-black mb-6">
          📋 Recent Audit Log
        </h2>
        <div className="rounded-xl bg-slate-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-6 py-4 text-left font-semibold text-slate-400">Action</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-400">Target</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-400">Actor</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-400">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {recentLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        log.action === "removed" || log.action === "banned" || log.action === "suspended"
                          ? "bg-red-500/20 text-red-400"
                          : log.action === "approved"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300 max-w-xs truncate">
                    <span className="text-slate-500 text-xs mr-2 capitalize">
                      {log.targetType}
                    </span>
                    {log.targetLabel}
                  </td>
                  <td className="px-6 py-4 text-slate-300">{log.actorName}</td>
                  <td className="px-6 py-4 text-slate-500">
                    <time dateTime={log.timestamp}>
                      {new Date(log.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Community overview */}
      <section className="mt-12 grid gap-8 lg:grid-cols-2" aria-labelledby="overview-heading">
        <div>
          <h2 id="overview-heading" className="text-2xl font-black mb-6">
            Recent Discussions
          </h2>
          <div className="space-y-3">
            {DISCUSSIONS.slice(0, 4).map((d) => (
              <div
                key={d.id}
                className="flex items-start justify-between gap-4 rounded-lg bg-slate-800 p-4"
              >
                <div className="min-w-0">
                  <Link
                    href={`/community/discussion/${d.id}`}
                    className="font-semibold text-white hover:text-yellow-400 transition-colors text-sm line-clamp-1"
                  >
                    {d.title}
                  </Link>
                  <p className="text-xs text-slate-500 mt-1 capitalize">
                    {d.category} · {d.replyCount} replies · {d.likes} likes
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    d.status === "approved"
                      ? "bg-green-500/20 text-green-400"
                      : d.status === "removed"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black mb-6">Top Members</h2>
          <div className="space-y-3">
            {COMMUNITY_MEMBERS.slice(0, 4).map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-lg bg-slate-800 p-4"
              >
                <div
                  className={`h-9 w-9 rounded-full ${m.avatarColor} flex items-center justify-center text-xs font-bold text-white shrink-0`}
                  aria-hidden="true"
                >
                  {m.avatarInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">
                    {m.displayName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {m.reputationPoints.toLocaleString()} rep ·{" "}
                    <span className="capitalize">{m.standing}</span>
                  </p>
                </div>
                <Link
                  href="/admin/community/users"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors shrink-0"
                >
                  Manage
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
