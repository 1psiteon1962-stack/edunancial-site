import Link from "next/link";
import { workflowStore } from "@/lib/workflow/workflowStore";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-700 text-gray-300",
  published: "bg-emerald-900 text-emerald-300",
  archived: "bg-slate-700 text-slate-300",
  paused: "bg-amber-900 text-amber-300",
};

export default function WorkflowsAdminPage() {
  const workflows = workflowStore.listWorkflows();
  const stats = workflowStore.getStats();
  const statsMap = new Map(stats.map((s) => [s.workflowId, s]));

  const published = workflows.filter((w) => w.status === "published");
  const drafts = workflows.filter((w) => w.status === "draft");
  const archived = workflows.filter((w) => w.status === "archived");

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-5xl font-black">Workflow Automation</h1>
        <Link
          href="/admin/workflows/builder"
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Create new workflow"
        >
          + New Workflow
        </Link>
      </div>

      <p className="text-gray-400 mt-2 mb-10">
        Business process automation — build, publish, and monitor workflows.
      </p>

      {/* Summary stats */}
      <div className="grid gap-6 mb-12 md:grid-cols-4">
        {[
          ["Total Workflows", workflows.length],
          ["Published", published.length],
          ["Drafts", drafts.length],
          ["Archived", archived.length],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"
          >
            <p className="text-gray-400 text-sm">{label}</p>
            <p className="mt-2 text-4xl font-black">{value}</p>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-3 mb-10">
        {[
          { label: "Queue", href: "/admin/workflows/queue" },
          { label: "Failed", href: "/admin/workflows/failed" },
          { label: "History", href: "/admin/workflows/history" },
          { label: "Statistics", href: "/admin/workflows/statistics" },
          { label: "Audit Trail", href: "/admin/workflows/audit" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-white/10 bg-[#101a2f] px-5 py-2 text-sm font-semibold hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Workflow list */}
      <h2 className="text-2xl font-bold mb-4">All Workflows</h2>
      {workflows.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-12 text-center text-gray-400">
          No workflows yet.{" "}
          <Link href="/admin/workflows/builder" className="text-blue-400 underline">
            Create your first workflow.
          </Link>
        </div>
      ) : (
        <div
          role="table"
          aria-label="Workflows"
          className="rounded-2xl border border-white/10 overflow-hidden"
        >
          <div
            role="rowgroup"
            className="grid grid-cols-5 bg-[#0d1627] px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide"
          >
            <span role="columnheader">Name</span>
            <span role="columnheader">Trigger</span>
            <span role="columnheader">Status</span>
            <span role="columnheader">Executions</span>
            <span role="columnheader">Actions</span>
          </div>

          {workflows.map((wf) => {
            const wfStats = statsMap.get(wf.id);
            return (
              <div
                key={wf.id}
                role="row"
                className="grid grid-cols-5 items-center bg-[#101a2f] px-6 py-4 border-t border-white/5 hover:bg-[#131f38]"
              >
                <span role="cell" className="font-semibold">
                  {wf.name}
                </span>
                <span role="cell" className="text-sm text-gray-400 font-mono">
                  {wf.triggerEvent}
                </span>
                <span role="cell">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      STATUS_COLORS[wf.status] ?? "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {wf.status}
                  </span>
                </span>
                <span role="cell" className="text-sm text-gray-300">
                  {wfStats?.totalExecutions ?? 0} total ·{" "}
                  <span className="text-emerald-400">
                    {wfStats?.successRate ?? 0}% success
                  </span>
                </span>
                <span role="cell" className="flex gap-3 text-sm">
                  <Link
                    href={`/admin/workflows/builder?id=${wf.id}`}
                    className="text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                    aria-label={`Edit workflow ${wf.name}`}
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/admin/workflows/history?workflowId=${wf.id}`}
                    className="text-gray-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                    aria-label={`View history for ${wf.name}`}
                  >
                    History
                  </Link>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
