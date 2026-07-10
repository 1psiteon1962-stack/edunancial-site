import Link from "next/link";
import { workflowStore } from "@/lib/workflow/workflowStore";
import { ExecutionStatus } from "@/lib/workflow/workflowTypes";

const STATUS_COLORS: Record<ExecutionStatus, string> = {
  pending: "bg-gray-700 text-gray-300",
  running: "bg-blue-900 text-blue-300",
  completed: "bg-emerald-900 text-emerald-300",
  failed: "bg-red-900 text-red-300",
  cancelled: "bg-slate-700 text-slate-300",
  waiting_approval: "bg-amber-900 text-amber-300",
  retrying: "bg-orange-900 text-orange-300",
};

export default function WorkflowHistoryPage() {
  const executions = workflowStore
    .listExecutions()
    .sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );

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

      <h1 className="text-5xl font-black mb-2">Execution History</h1>
      <p className="text-gray-400 mb-10">
        Complete log of all workflow execution runs.
      </p>

      {/* Status summary */}
      <div className="grid gap-6 mb-12 md:grid-cols-4">
        {(
          [
            ["Total", executions.length, ""],
            [
              "Completed",
              executions.filter((e) => e.status === "completed").length,
              "text-emerald-400",
            ],
            [
              "Failed",
              executions.filter((e) => e.status === "failed").length,
              "text-red-400",
            ],
            [
              "Running",
              executions.filter(
                (e) => e.status === "running" || e.status === "retrying"
              ).length,
              "text-blue-400",
            ],
          ] as [string, number, string][]
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

      {executions.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-12 text-center text-gray-400">
          No execution history yet.
        </div>
      ) : (
        <div
          role="table"
          aria-label="Workflow execution history"
          className="rounded-2xl border border-white/10 overflow-hidden"
        >
          <div
            role="rowgroup"
            className="grid grid-cols-6 bg-[#0d1627] px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide"
          >
            <span role="columnheader">Workflow</span>
            <span role="columnheader">Trigger</span>
            <span role="columnheader">Status</span>
            <span role="columnheader">Started</span>
            <span role="columnheader">Completed</span>
            <span role="columnheader">Duration</span>
          </div>

          {executions.map((exec) => {
            const duration =
              exec.completedAt
                ? Math.round(
                    (new Date(exec.completedAt).getTime() -
                      new Date(exec.startedAt).getTime()) /
                      1000
                  )
                : null;

            return (
              <div
                key={exec.id}
                role="row"
                className="grid grid-cols-6 items-center bg-[#101a2f] px-6 py-4 border-t border-white/5 hover:bg-[#131f38]"
              >
                <span role="cell" className="font-semibold text-sm truncate">
                  {exec.workflowName}
                </span>
                <span role="cell" className="text-xs text-gray-400 font-mono">
                  {exec.triggerEvent}
                </span>
                <span role="cell">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      STATUS_COLORS[exec.status] ?? ""
                    }`}
                  >
                    {exec.status.replace("_", " ")}
                  </span>
                </span>
                <span role="cell" className="text-sm text-gray-400">
                  {new Date(exec.startedAt).toLocaleString()}
                </span>
                <span role="cell" className="text-sm text-gray-400">
                  {exec.completedAt
                    ? new Date(exec.completedAt).toLocaleString()
                    : "—"}
                </span>
                <span role="cell" className="text-sm text-gray-400">
                  {duration !== null ? `${duration}s` : "—"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
