import Link from "next/link";
import { workflowQueue } from "@/lib/workflow/workflowQueue";
import { workflowStore } from "@/lib/workflow/workflowStore";

export default function WorkflowQueuePage() {
  const queued = workflowQueue.listQueued();
  const processing = workflowQueue.listProcessing();
  const deadLetter = workflowQueue.listDeadLetter();

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-10">
      <div className="flex items-center gap-4 mb-2">
        <Link
          href="/admin/workflows"
          className="text-blue-400 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Back to workflows"
        >
          ← Workflows
        </Link>
      </div>
      <h1 className="text-5xl font-black mb-2">Processing Queue</h1>
      <p className="text-gray-400 mb-10">
        Real-time view of workflow execution queue items.
      </p>

      {/* Queue summary */}
      <div className="grid gap-6 mb-12 md:grid-cols-3">
        {[
          ["Queued", queued.length, "text-amber-400"],
          ["Processing", processing.length, "text-blue-400"],
          ["Dead Letter", deadLetter.length, "text-red-400"],
        ].map(([label, value, color]) => (
          <div
            key={String(label)}
            className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"
          >
            <p className="text-gray-400 text-sm">{label}</p>
            <p className={`mt-2 text-4xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Active queue */}
      <section aria-labelledby="active-queue-heading" className="mb-10">
        <h2 id="active-queue-heading" className="text-2xl font-bold mb-4">
          Active Queue
        </h2>
        {queued.length === 0 && processing.length === 0 ? (
          <p className="text-gray-500 italic">Queue is empty.</p>
        ) : (
          <QueueTable
            items={[...processing, ...queued]}
            store={workflowStore}
          />
        )}
      </section>

      {/* Dead letter queue */}
      <section aria-labelledby="dead-letter-heading">
        <h2 id="dead-letter-heading" className="text-2xl font-bold mb-4">
          Dead Letter Queue
          <span className="ml-3 text-sm text-gray-400 font-normal">
            Items that exhausted all retry attempts
          </span>
        </h2>
        {deadLetter.length === 0 ? (
          <p className="text-gray-500 italic">No dead letter items.</p>
        ) : (
          <QueueTable items={deadLetter} store={workflowStore} />
        )}
      </section>
    </main>
  );
}

function QueueTable({
  items,
  store,
}: {
  items: ReturnType<typeof workflowQueue.listAll>;
  store: typeof workflowStore;
}) {
  const STATUS_COLORS: Record<string, string> = {
    queued: "bg-amber-900 text-amber-300",
    processing: "bg-blue-900 text-blue-300",
    done: "bg-emerald-900 text-emerald-300",
    dead_letter: "bg-red-900 text-red-300",
  };

  return (
    <div
      role="table"
      aria-label="Queue items"
      className="rounded-2xl border border-white/10 overflow-hidden"
    >
      <div
        role="rowgroup"
        className="grid grid-cols-5 bg-[#0d1627] px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide"
      >
        <span role="columnheader">Workflow</span>
        <span role="columnheader">Node</span>
        <span role="columnheader">Status</span>
        <span role="columnheader">Scheduled</span>
        <span role="columnheader">Attempts</span>
      </div>
      {items.map((item) => {
        const workflow = store.getWorkflow(item.workflowId);
        return (
          <div
            key={item.id}
            role="row"
            className="grid grid-cols-5 items-center bg-[#101a2f] px-6 py-4 border-t border-white/5"
          >
            <span role="cell" className="font-semibold text-sm">
              {workflow?.name ?? item.workflowId}
            </span>
            <span role="cell" className="text-sm text-gray-400 font-mono">
              {item.nodeId}
            </span>
            <span role="cell">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  STATUS_COLORS[item.status] ?? ""
                }`}
              >
                {item.status.replace("_", " ")}
              </span>
            </span>
            <span role="cell" className="text-sm text-gray-400">
              {new Date(item.scheduledAt).toLocaleString()}
            </span>
            <span role="cell" className="text-sm text-gray-400">
              {item.attempts}/{item.maxAttempts}
              {item.lastError && (
                <span className="ml-2 text-red-400 text-xs" title={item.lastError}>
                  ⚠
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
