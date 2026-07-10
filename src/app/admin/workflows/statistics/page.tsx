import Link from "next/link";
import { workflowStore } from "@/lib/workflow/workflowStore";

export default function WorkflowStatisticsPage() {
  const stats = workflowStore.getStats();
  const allExecutions = workflowStore.listExecutions();

  const totalExecutions = allExecutions.length;
  const totalCompleted = allExecutions.filter(
    (e) => e.status === "completed"
  ).length;
  const totalFailed = allExecutions.filter((e) => e.status === "failed").length;
  const overallSuccessRate =
    totalExecutions > 0
      ? Math.round((totalCompleted / totalExecutions) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-10">
      <div className="flex items-center gap-4 mb-2">
        <Link
          href="/admin/workflows"
          className="text-blue-400 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
        >
          ← Workflows
        </Link>
      </div>

      <h1 className="text-5xl font-black mb-2">Execution Statistics</h1>
      <p className="text-gray-400 mb-10">
        Performance metrics and success rates per workflow.
      </p>

      {/* Global stats */}
      <div className="grid gap-6 mb-12 md:grid-cols-4">
        {(
          [
            ["Total Executions", totalExecutions, ""],
            ["Completed", totalCompleted, "text-emerald-400"],
            ["Failed", totalFailed, "text-red-400"],
            ["Success Rate", `${overallSuccessRate}%`, "text-blue-400"],
          ] as [string, string | number, string][]
        ).map(([label, value, color]) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"
          >
            <p className="text-gray-400 text-sm">{label}</p>
            <p className={`mt-2 text-4xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Per-workflow stats */}
      <h2 className="text-2xl font-bold mb-4">Per-Workflow Breakdown</h2>
      {stats.length === 0 ? (
        <p className="text-gray-500 italic">No data yet.</p>
      ) : (
        <div
          role="table"
          aria-label="Workflow statistics"
          className="rounded-2xl border border-white/10 overflow-hidden"
        >
          <div
            role="rowgroup"
            className="grid grid-cols-6 bg-[#0d1627] px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide"
          >
            <span role="columnheader">Workflow</span>
            <span role="columnheader">Total</span>
            <span role="columnheader">Completed</span>
            <span role="columnheader">Failed</span>
            <span role="columnheader">Avg Duration</span>
            <span role="columnheader">Success Rate</span>
          </div>

          {stats.map((s) => (
            <div
              key={s.workflowId}
              role="row"
              className="grid grid-cols-6 items-center bg-[#101a2f] px-6 py-4 border-t border-white/5 hover:bg-[#131f38]"
            >
              <span role="cell" className="font-semibold text-sm">
                {s.workflowName}
              </span>
              <span role="cell" className="text-sm text-gray-300">
                {s.totalExecutions}
              </span>
              <span role="cell" className="text-sm text-emerald-400">
                {s.successfulExecutions}
              </span>
              <span role="cell" className="text-sm text-red-400">
                {s.failedExecutions}
              </span>
              <span role="cell" className="text-sm text-gray-400">
                {s.avgDurationMs > 0
                  ? `${(s.avgDurationMs / 1000).toFixed(1)}s`
                  : "—"}
              </span>
              <span role="cell" className="font-semibold">
                <SuccessBar rate={s.successRate} />
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function SuccessBar({ rate }: { rate: number }) {
  const color =
    rate >= 90
      ? "bg-emerald-500"
      : rate >= 70
      ? "bg-amber-500"
      : "bg-red-500";
  return (
    <div className="flex items-center gap-2" aria-label={`${rate}% success`}>
      <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${rate}%` }}
          role="progressbar"
          aria-valuenow={rate}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <span className="text-sm text-gray-300">{rate}%</span>
    </div>
  );
}
