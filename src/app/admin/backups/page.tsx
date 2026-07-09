import { getDemoSummary, getDemoSchedules, getDemoBackupRecords } from "@/lib/backup";
import { type BackupStatus, type BackupTarget } from "@/lib/backup";
import StatusBadge from "@/components/monitoring/StatusBadge";
import Link from "next/link";

export const metadata = { title: "Backup Management" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatBytes(bytes: number): string {
  if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(1)} TB`;
  if (bytes >= 1e9)  return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6)  return `${(bytes / 1e6).toFixed(1)} MB`;
  return `${bytes} B`;
}

function formatAge(ms: number): string {
  const diff = Date.now() - ms;
  const h = Math.floor(diff / 3_600_000);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const TARGET_LABELS: Record<BackupTarget, string> = {
  database:        "Database",
  user_uploads:    "User Uploads",
  config_files:    "Config Files",
  cms_content:     "CMS Content",
  course_assets:   "Course Assets",
  system_settings: "System Settings",
};

function backupStatusToHealth(status: BackupStatus): "healthy" | "degraded" | "down" {
  if (status === "completed" || status === "verified") return "healthy";
  if (status === "running" || status === "verifying") return "degraded";
  if (status === "failed") return "down";
  return "degraded";
}

export default async function BackupsPage() {
  const [summary, schedules, records] = await Promise.all([
    getDemoSummary(),
    getDemoSchedules(),
    getDemoBackupRecords(),
  ]);

  const recentBySchedule = schedules.map((sched) => {
    const latest = records
      .filter((r) => r.scheduleId === sched.id)
      .sort((a, b) => b.startedAt - a.startedAt)[0];
    return { sched, latest };
  });

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-6 md:p-10">

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black md:text-5xl">Backup Management</h1>
          <p className="mt-2 text-gray-400">Automated backup schedules, verification, and restore readiness</p>
        </div>
        <Link href="/admin/infrastructure" className="text-sm text-blue-400 hover:underline">← Infrastructure Dashboard</Link>
      </div>

      {/* Summary stats */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Backup summary">
        <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <p className="text-sm text-gray-400">Total Backups</p>
          <p className="mt-2 text-3xl font-black text-white">{summary.totalBackups}</p>
        </div>
        <div className="rounded-2xl border border-emerald-700/40 bg-emerald-900/10 p-6">
          <p className="text-sm text-gray-400">Verified</p>
          <p className="mt-2 text-3xl font-black text-emerald-400">{summary.verifiedCount}</p>
        </div>
        <div className={`rounded-2xl border p-6 ${summary.failedCount > 0 ? "border-red-700/40 bg-red-900/10" : "border-white/10 bg-[#101a2f]"}`}>
          <p className="text-sm text-gray-400">Failed</p>
          <p className={`mt-2 text-3xl font-black ${summary.failedCount > 0 ? "text-red-400" : "text-emerald-400"}`}>{summary.failedCount}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <p className="text-sm text-gray-400">Total Storage</p>
          <p className="mt-2 text-3xl font-black text-white">{formatBytes(summary.totalStorageBytes)}</p>
        </div>
      </section>

      {/* Schedule status */}
      <section className="mt-8" aria-label="Backup schedules">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Backup Schedules</h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400">
                {["Schedule", "Target", "Frequency", "Last Run", "Next Run", "Geo Redundancy", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBySchedule.map(({ sched, latest }) => (
                <tr key={sched.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{sched.name}</td>
                  <td className="px-4 py-3 text-gray-300">{TARGET_LABELS[sched.target]}</td>
                  <td className="px-4 py-3 text-gray-400 capitalize">{sched.frequency}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{sched.lastRunAt ? formatAge(sched.lastRunAt) : "Never"}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(sched.nextRunAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {sched.geoRedundancy
                      ? <span className="text-emerald-400 text-xs font-semibold">✓ Enabled</span>
                      : <span className="text-gray-500 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {latest
                      ? <StatusBadge status={backupStatusToHealth(latest.status)} label={latest.status} size="sm" />
                      : <StatusBadge status="unknown" label="no data" size="sm" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent backup records */}
      <section className="mt-8" aria-label="Recent backup records">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Recent Backup Records</h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400">
                {["ID", "Target", "Started", "Size", "Verified", "Status", "Error"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.slice(0, 20).map((rec) => (
                <tr key={rec.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{rec.id}</td>
                  <td className="px-4 py-3 text-gray-300">{TARGET_LABELS[rec.target]}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatAge(rec.startedAt)}</td>
                  <td className="px-4 py-3 text-gray-300">{rec.sizeBytes ? formatBytes(rec.sizeBytes) : "—"}</td>
                  <td className="px-4 py-3">
                    {rec.verified
                      ? <span className="text-emerald-400 text-xs font-semibold">✓</span>
                      : <span className="text-gray-600 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={backupStatusToHealth(rec.status)} label={rec.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-red-400 text-xs">{rec.error ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* PITR and extension info */}
      <section className="mt-8 rounded-2xl border border-blue-700/30 bg-blue-900/10 p-6" aria-label="Backup architecture notes">
        <h2 className="text-sm font-semibold text-blue-300 mb-3">Architecture & Extension Points</h2>
        <ul className="text-sm text-gray-400 space-y-1.5 list-disc list-inside">
          <li>Implement <code className="text-blue-300">BackupProvider</code> interface in <code className="text-blue-300">src/lib/backup/providers.ts</code> for S3, GCS, or Azure Blob</li>
          <li>Point-in-time recovery: enable WAL archiving in <code className="text-blue-300">PointInTimeRecoveryConfig</code> and wire to your DB provider</li>
          <li>Backup verification: call <code className="text-blue-300">provider.verify(backupId)</code> — runs checksum + restore test in staging</li>
          <li>Geographic redundancy: set <code className="text-blue-300">geoRedundancy: true</code> on schedules and configure a secondary region storage URI</li>
          <li>Restore requests flow through <code className="text-blue-300">RestoreRequest</code> with approval workflow support</li>
        </ul>
      </section>

    </main>
  );
}
