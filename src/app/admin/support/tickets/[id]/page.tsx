"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import type { TicketMessage, TicketPriority, TicketStatus } from "@/types/support";

const agentOptions = ["", "Sarah J.", "Mike R.", "Alex T."] as const;

const initialMessages: TicketMessage[] = [
  {
    id: "message-1",
    ticketId: "mock-ticket",
    authorId: "member-201",
    authorName: "Olivia Carter",
    authorRole: "member",
    content:
      "I upgraded my membership this morning, but Budgeting Basics is still locked on my dashboard.",
    createdAt: "2026-07-09 08:15 AM",
    isInternal: false,
  },
  {
    id: "message-2",
    ticketId: "mock-ticket",
    authorId: "agent-1",
    authorName: "Sarah J.",
    authorRole: "agent",
    content:
      "Thanks for the details. I can see the payment completed successfully, so I’m checking the enrollment sync now.",
    createdAt: "2026-07-09 08:37 AM",
    isInternal: false,
  },
  {
    id: "message-3",
    ticketId: "mock-ticket",
    authorId: "agent-1",
    authorName: "Sarah J.",
    authorRole: "agent",
    content: "Enrollment refresh requested. Waiting on course access service confirmation.",
    createdAt: "2026-07-09 08:44 AM",
    isInternal: true,
  },
  {
    id: "message-4",
    ticketId: "mock-ticket",
    authorId: "member-201",
    authorName: "Olivia Carter",
    authorRole: "member",
    content:
      "Appreciate the update. I’m trying to start the lesson before tonight’s workshop if possible.",
    createdAt: "2026-07-09 08:49 AM",
    isInternal: false,
  },
];

function getStatusBadgeClass(status: TicketStatus) {
  return {
    open: "bg-blue-600/20 text-blue-400",
    in_progress: "bg-yellow-600/20 text-yellow-400",
    pending: "bg-orange-600/20 text-orange-400",
    resolved: "bg-green-600/20 text-green-400",
    closed: "bg-slate-600/20 text-slate-400",
  }[status];
}

function getPriorityBadgeClass(priority: TicketPriority) {
  return {
    urgent: "bg-red-600/20 text-red-400",
    high: "bg-orange-600/20 text-orange-400",
    medium: "bg-yellow-600/20 text-yellow-400",
    low: "bg-slate-600/20 text-slate-400",
  }[priority];
}

function formatStatus(status: TicketStatus) {
  return status.replace("_", " ");
}

export default function AdminSupportTicketDetailPage() {
  const params = useParams<{ id: string }>();
  const ticketId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [messages, setMessages] = useState<TicketMessage[]>(initialMessages);
  const [reply, setReply] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [status, setStatus] = useState<TicketStatus>("open");
  const [priority, setPriority] = useState<TicketPriority>("high");
  const [assignedTo, setAssignedTo] = useState<string>("Sarah J.");
  const [isEscalated, setIsEscalated] = useState(false);

  const ticket = useMemo(
    () => ({
      id: ticketId ?? "TKT-1001",
      subject: "Unable to access Budgeting Basics after upgrade",
      category: "Membership",
      memberName: "Olivia Carter",
      memberEmail: "olivia.carter@example.com",
      createdAt: "2026-07-09 08:15 AM",
      updatedAt: "2026-07-09 09:10 AM",
    }),
    [ticketId],
  );

  const handleSend = () => {
    const content = reply.trim();

    if (!content) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `message-${currentMessages.length + 1}`,
        ticketId: ticket.id,
        authorId: "agent-1",
        authorName: assignedTo || "Support Team",
        authorRole: "agent",
        content,
        createdAt: new Date().toLocaleString(),
        isInternal: isInternalNote,
      },
    ]);
    setReply("");
    setIsInternalNote(false);
  };

  return (
    <main className="min-h-screen bg-[#08101f] p-10 text-white">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,2fr)_360px]">
        <div className="space-y-8">
          <section className="rounded-xl border border-white/10 bg-slate-900 p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
                  SUPPORT TICKET
                </p>
                <h1 className="mt-6 text-5xl font-black">{ticket.subject}</h1>
                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusBadgeClass(status)}`}
                  >
                    {formatStatus(status)}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getPriorityBadgeClass(priority)}`}
                  >
                    {priority}
                  </span>
                  <span>{ticket.category}</span>
                  {isEscalated ? (
                    <span className="inline-flex rounded-full bg-red-600/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-400">
                      Escalated
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setIsEscalated((currentValue) => !currentValue)}
                  className="rounded-lg border border-white/10 px-5 py-3 font-bold transition hover:border-blue-500"
                >
                  {isEscalated ? "Remove Escalation" : "Escalate"}
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("resolved")}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-bold transition hover:bg-blue-500"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-[#101a2f] p-8">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label htmlFor="status" className="mb-2 block text-sm font-bold text-slate-300">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as TicketStatus)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="mb-2 block text-sm font-bold text-slate-300">
                  Priority
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value as TicketPriority)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label htmlFor="assignee" className="mb-2 block text-sm font-bold text-slate-300">
                  Assign to
                </label>
                <select
                  id="assignee"
                  value={assignedTo}
                  onChange={(event) => setAssignedTo(event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                >
                  {agentOptions.map((agent) => (
                    <option key={agent || "unassigned"} value={agent}>
                      {agent || "Unassigned"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-3xl font-black">Conversation Thread</h2>
            <div className="mt-8 space-y-4">
              {messages.map((message) => {
                const isMember = message.authorRole === "member";

                return (
                  <article
                    key={message.id}
                    className={`max-w-3xl rounded-xl border p-5 ${
                      message.isInternal
                        ? "border-yellow-600/30 bg-yellow-600/10"
                        : isMember
                          ? "mr-auto border-white/10 bg-[#101a2f]"
                          : "ml-auto border-blue-500/40 bg-blue-600/10"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-white">{message.authorName}</p>
                        {message.isInternal ? (
                          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-yellow-400">
                            Internal Note — not visible to member
                          </p>
                        ) : (
                          <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                            {isMember ? "Member" : "Agent Reply"}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">{message.createdAt}</p>
                    </div>
                    <p className="mt-3 text-slate-300">{message.content}</p>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 rounded-xl border border-white/10 bg-[#101a2f] p-6">
              <label htmlFor="reply" className="mb-2 block text-sm font-bold text-slate-300">
                Reply
              </label>
              <textarea
                id="reply"
                rows={5}
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                placeholder="Write an update, resolution, or internal note."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              />
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={isInternalNote}
                    onChange={(event) => setIsInternalNote(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
                  />
                  Internal Note
                </label>
                <button
                  type="button"
                  onClick={handleSend}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-bold transition hover:bg-blue-500"
                >
                  Send
                </button>
              </div>
            </div>
          </section>

          {status === "resolved" ? (
            <section className="rounded-xl border border-white/10 bg-slate-900 p-8">
              <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
                FEEDBACK
              </p>
              <h2 className="mt-6 text-3xl font-black">Member satisfaction preview</h2>
              <p className="mt-4 text-slate-300">
                Once resolved, members can submit a satisfaction score for their support experience.
              </p>
              <div className="mt-6 inline-flex rounded-xl border border-green-600/30 bg-green-600/10 px-5 py-4 text-green-400">
                4/5 stars
              </div>
            </section>
          ) : null}
        </div>

        <aside className="h-fit rounded-xl border border-white/10 bg-slate-900 p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black">Ticket Metadata</h2>
            <Link href="/admin/support" className="text-sm font-bold text-blue-400 hover:text-blue-300">
              Back
            </Link>
          </div>
          <dl className="mt-8 space-y-5 text-sm">
            <div>
              <dt className="text-slate-400">ID</dt>
              <dd className="mt-1 font-bold text-white">{ticket.id}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Member</dt>
              <dd className="mt-1 font-bold text-white">{ticket.memberName}</dd>
              <dd className="mt-1 text-slate-300">{ticket.memberEmail}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Category</dt>
              <dd className="mt-1 text-slate-300">{ticket.category}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Status</dt>
              <dd className="mt-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusBadgeClass(status)}`}
                >
                  {formatStatus(status)}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Priority</dt>
              <dd className="mt-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getPriorityBadgeClass(priority)}`}
                >
                  {priority}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Assigned Agent</dt>
              <dd className="mt-1 text-slate-300">{assignedTo || "Unassigned"}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Created</dt>
              <dd className="mt-1 text-slate-300">{ticket.createdAt}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Updated</dt>
              <dd className="mt-1 text-slate-300">{ticket.updatedAt}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </main>
  );
}
