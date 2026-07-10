import Link from "next/link";
import { COMMUNITY_MEMBERS, BADGE_LABELS, BADGE_COLORS } from "@/data/community";

export const metadata = {
  title: "User Management | Admin | Edunancial",
};

const STANDING_COLORS: Record<string, string> = {
  good: "bg-green-500/20 text-green-400",
  warned: "bg-yellow-500/20 text-yellow-400",
  suspended: "bg-orange-500/20 text-orange-400",
  banned: "bg-red-500/20 text-red-400",
};

export default function AdminUsersPage() {
  const sortedMembers = [...COMMUNITY_MEMBERS].sort(
    (a, b) => b.reputationPoints - a.reputationPoints
  );

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
          <li className="text-slate-200" aria-current="page">User Management</li>
        </ol>
      </nav>

      <h1 className="text-5xl font-black">User Management</h1>
      <p className="mt-4 text-xl text-slate-300">
        Issue warnings, suspensions, and bans. Manage member standing and
        reputation.
      </p>

      {/* Standing summary */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(["good", "warned", "suspended", "banned"] as const).map((standing) => {
          const count = COMMUNITY_MEMBERS.filter(
            (m) => m.standing === standing
          ).length;
          return (
            <div
              key={standing}
              className="rounded-xl bg-slate-800 p-6 text-center"
            >
              <p className="text-sm uppercase tracking-wider text-slate-400 capitalize">
                {standing}
              </p>
              <p className="mt-2 text-4xl font-black text-white">{count}</p>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${STANDING_COLORS[standing]}`}
              >
                {standing === "good"
                  ? "Good Standing"
                  : standing === "warned"
                  ? "Warned"
                  : standing === "suspended"
                  ? "Suspended"
                  : "Banned"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="mt-10">
        <label htmlFor="user-search" className="sr-only">
          Search users
        </label>
        <input
          id="user-search"
          type="search"
          placeholder="Search members by name or username..."
          className="w-full max-w-md rounded-xl bg-slate-800 border border-slate-600 px-5 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-yellow-400 transition-colors"
          aria-label="Search community members"
        />
      </div>

      {/* User table */}
      <section className="mt-8" aria-labelledby="users-table-heading">
        <h2 id="users-table-heading" className="sr-only">
          Community Members
        </h2>
        <div className="rounded-xl bg-slate-800 overflow-hidden">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-slate-700">
                <th scope="col" className="px-6 py-4 text-left font-semibold text-slate-400">
                  Member
                </th>
                <th scope="col" className="px-6 py-4 text-left font-semibold text-slate-400">
                  Badge
                </th>
                <th scope="col" className="px-6 py-4 text-left font-semibold text-slate-400">
                  Reputation
                </th>
                <th scope="col" className="px-6 py-4 text-left font-semibold text-slate-400">
                  Posts
                </th>
                <th scope="col" className="px-6 py-4 text-left font-semibold text-slate-400">
                  Standing
                </th>
                <th scope="col" className="px-6 py-4 text-left font-semibold text-slate-400">
                  Joined
                </th>
                <th scope="col" className="px-6 py-4 text-left font-semibold text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {sortedMembers.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-8 w-8 rounded-full ${member.avatarColor} flex items-center justify-center text-xs font-bold text-white shrink-0`}
                        aria-hidden="true"
                      >
                        {member.avatarInitials}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {member.displayName}
                        </p>
                        <p className="text-xs text-slate-500">
                          @{member.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 text-xs ${BADGE_COLORS[member.badge]}`}
                    >
                      {BADGE_LABELS[member.badge]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-yellow-400 font-semibold">
                    {member.reputationPoints.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {member.postCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STANDING_COLORS[member.standing]}`}
                    >
                      {member.standing}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <time dateTime={member.joinedDate}>
                      {new Date(member.joinedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {member.standing === "good" && (
                        <>
                          <button
                            type="button"
                            className="rounded bg-yellow-700 px-3 py-1 text-xs font-bold text-white hover:bg-yellow-600 transition-colors"
                            aria-label={`Issue warning to ${member.displayName}`}
                          >
                            Warn
                          </button>
                          <button
                            type="button"
                            className="rounded bg-orange-700 px-3 py-1 text-xs font-bold text-white hover:bg-orange-600 transition-colors"
                            aria-label={`Suspend ${member.displayName}`}
                          >
                            Suspend
                          </button>
                          <button
                            type="button"
                            className="rounded bg-red-700 px-3 py-1 text-xs font-bold text-white hover:bg-red-600 transition-colors"
                            aria-label={`Ban ${member.displayName}`}
                          >
                            Ban
                          </button>
                        </>
                      )}
                      {member.standing === "warned" && (
                        <>
                          <button
                            type="button"
                            className="rounded bg-orange-700 px-3 py-1 text-xs font-bold text-white hover:bg-orange-600 transition-colors"
                            aria-label={`Suspend ${member.displayName}`}
                          >
                            Suspend
                          </button>
                          <button
                            type="button"
                            className="rounded bg-red-700 px-3 py-1 text-xs font-bold text-white hover:bg-red-600 transition-colors"
                            aria-label={`Ban ${member.displayName}`}
                          >
                            Ban
                          </button>
                          <button
                            type="button"
                            className="rounded bg-green-700 px-3 py-1 text-xs font-bold text-white hover:bg-green-600 transition-colors"
                            aria-label={`Clear warning for ${member.displayName}`}
                          >
                            Clear
                          </button>
                        </>
                      )}
                      {member.standing === "suspended" && (
                        <>
                          <button
                            type="button"
                            className="rounded bg-green-700 px-3 py-1 text-xs font-bold text-white hover:bg-green-600 transition-colors"
                            aria-label={`Reinstate ${member.displayName}`}
                          >
                            Reinstate
                          </button>
                          <button
                            type="button"
                            className="rounded bg-red-700 px-3 py-1 text-xs font-bold text-white hover:bg-red-600 transition-colors"
                            aria-label={`Permanently ban ${member.displayName}`}
                          >
                            Perm Ban
                          </button>
                        </>
                      )}
                      {member.standing === "banned" && (
                        <button
                          type="button"
                          className="rounded bg-slate-600 px-3 py-1 text-xs font-bold text-white hover:bg-slate-500 transition-colors"
                          aria-label={`Unban ${member.displayName}`}
                        >
                          Unban
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Moderation guidelines */}
      <section
        className="mt-12 rounded-xl bg-blue-900/20 border border-blue-500/30 p-8"
        aria-labelledby="guidelines-heading"
      >
        <h2 id="guidelines-heading" className="text-xl font-black mb-4 text-blue-300">
          Moderation Guidelines
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 text-sm text-slate-300">
          <div>
            <h3 className="font-bold text-yellow-400 mb-2">⚠️ Warning</h3>
            <p>Issue for first-time minor violations: off-topic posts, mild rudeness, unverified claims. Warning is visible on user profile.</p>
          </div>
          <div>
            <h3 className="font-bold text-orange-400 mb-2">⏸️ Temporary Suspension</h3>
            <p>Issue for repeat violations or single serious offenses. Standard periods: 3, 7, or 30 days. All posts remain visible.</p>
          </div>
          <div>
            <h3 className="font-bold text-red-400 mb-2">🚫 Permanent Ban</h3>
            <p>Reserve for egregious violations: financial fraud solicitation, repeated harassment, persistent spam, or platform abuse.</p>
          </div>
          <div>
            <h3 className="font-bold text-green-400 mb-2">📋 Audit Log</h3>
            <p>All moderation actions are logged with timestamp, actor, reason, and outcome. Logs are retained for 12 months.</p>
          </div>
        </div>
      </section>

    </main>
  );
}
