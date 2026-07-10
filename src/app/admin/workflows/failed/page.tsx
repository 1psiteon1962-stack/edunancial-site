import Link from "next/link";
import { workflowStore } from "@/lib/workflow/workflowStore";

export default function FailedWorkflowsPage() {
  const allExecutions = workflowStore.listExecutions();
  const failed = allExecutions
    .filter((e) => e.status === "failed")
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

      <h1 className="text-5xl font-black mb-2">Failed Workflows</h1>
      <p className="text-gray-400 mb-10">
        Executions that terminated with errors. Use retry to re-run from the
        failure point.
      </p>

      {/* Summary */}
      <div className="grid gap-6 mb-12 md:grid-cols-3">
        {[
          ["Total Failed", failed.length],
          [
            "Workflows Affected",
            new Set(failed.map((e) => e.workflowId)).size,
          ],
          [
            "Most Recent",
            failed[0]
              ? new Date(failed[0].startedAt).toLocaleDateString()
              : "—",
          ],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"
          >
            <p className="text-gray-400 text-sm">{label}</p>
            <p className="mt-2 text-3xl font-black text-red-400">{value}</p>
          </div>
        ))}
      </div>

      {failed.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-12 text-center text-gray-400">
          No failed executions.
        </div>
      ) : (
        <div
          role="table"
          aria-label="Failed workflow executions"
          className="rounded-2xl border border-white/10 overflow-hidden"
        >
          <div
            role="rowgroup"
            className="grid grid-cols-5 bg-[#0d1627] px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide"
          >
            <span role="columnheader">Workflow</span>
            <span role="columnheader">Trigger</span>
            <span role="columnheader">Error</span>
            <span role="columnheader">Started</span>
            <span role="columnheader">Actions</span>
          </div>

          {failed.map((exec) => (
            <div
              key={exec.id}
              role="row"
              className="grid grid-cols-5 items-start bg-[#101a2f] px-6 py-4 border-t border-white/5 hover:bg-[#131f38]"
            >
              <span role="cell" className="font-semibold text-sm">
                {exec.workflowName}
              </span>
              <span role="cell" className="text-xs text-gray-400 font-mono">
                {exec.triggerEvent}
              </span>
              <span
                role="cell"
                className="text-xs text-red-400 truncate max-w-xs"
                title={exec.error}
              >
                {exec.error ?? "Unknown error"}
              </span>
              <span role="cell" className="text-sm text-gray-400">
                {new Date(exec.startedAt).toLocaleString()}
              </span>
              <span role="cell">
                {/* Retry is a POST — client action needed; shown as placeholder */}
                <span className="text-xs text-gray-500 italic">
                  POST /api/workflows/executions/{exec.id} action=retry
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
