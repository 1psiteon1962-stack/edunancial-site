import Link from "next/link";
import { workflowStore } from "@/lib/workflow/workflowStore";

export default function WorkflowAuditPage() {
  // Build audit entries from executions (each execution + its node events)
  const executions = workflowStore
    .listExecutions()
    .sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );

  // Build a flat audit trail from executions
  interface AuditEntry {
    id: string;
    timestamp: string;
    event: string;
    workflow: string;
    executionId: string;
    status: string;
    actor: string;
  }

  const auditTrail: AuditEntry[] = executions.flatMap((exec) => {
    const entries: AuditEntry[] = [
      {
        id: `${exec.id}_start`,
        timestamp: exec.startedAt,
        event: "execution.started",
        workflow: exec.workflowName,
        executionId: exec.id,
        status: exec.status,
        actor: exec.executedBy ?? "system",
      },
    ];

    if (exec.completedAt) {
      entries.push({
        id: `${exec.id}_end`,
        timestamp: exec.completedAt,
        event:
          exec.status === "completed"
            ? "execution.completed"
            : exec.status === "failed"
            ? "execution.failed"
            : "execution.cancelled",
        workflow: exec.workflowName,
        executionId: exec.id,
        status: exec.status,
        actor: "system",
      });
    }

    return entries;
  });

  const sortedAudit = auditTrail.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const EVENT_COLORS: Record<string, string> = {
    "execution.started": "text-blue-400",
    "execution.completed": "text-emerald-400",
    "execution.failed": "text-red-400",
    "execution.cancelled": "text-gray-400",
  };

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

      <h1 className="text-5xl font-black mb-2">Workflow Audit Trail</h1>
      <p className="text-gray-400 mb-10">
        Immutable log of all workflow execution events for compliance and
        debugging.
      </p>

      <div className="mb-6 flex items-center gap-3 text-sm text-gray-400">
        <span>
          {sortedAudit.length} audit events across {executions.length} executions
        </span>
      </div>

      {sortedAudit.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-12 text-center text-gray-400">
          No audit events recorded yet.
        </div>
      ) : (
        <div
          role="table"
          aria-label="Workflow audit trail"
          className="rounded-2xl border border-white/10 overflow-hidden"
        >
          <div
            role="rowgroup"
            className="grid grid-cols-5 bg-[#0d1627] px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide"
          >
            <span role="columnheader">Timestamp</span>
            <span role="columnheader">Event</span>
            <span role="columnheader">Workflow</span>
            <span role="columnheader">Execution ID</span>
            <span role="columnheader">Actor</span>
          </div>

          {sortedAudit.map((entry) => (
            <div
              key={entry.id}
              role="row"
              className="grid grid-cols-5 items-center bg-[#101a2f] px-6 py-3 border-t border-white/5 hover:bg-[#131f38]"
            >
              <span role="cell" className="text-xs text-gray-400 font-mono">
                {new Date(entry.timestamp).toLocaleString()}
              </span>
              <span
                role="cell"
                className={`text-xs font-mono font-semibold ${
                  EVENT_COLORS[entry.event] ?? "text-gray-300"
                }`}
              >
                {entry.event}
              </span>
              <span role="cell" className="text-sm font-semibold truncate">
                {entry.workflow}
              </span>
              <span
                role="cell"
                className="text-xs text-gray-400 font-mono truncate"
                title={entry.executionId}
              >
                {entry.executionId}
              </span>
              <span role="cell" className="text-sm text-gray-400">
                {entry.actor}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
