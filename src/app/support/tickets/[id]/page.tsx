"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import type { TicketMessage, TicketPriority, TicketStatus } from "@/types/support";

function StatusBadge({ status }: { status: TicketStatus }) {
  const className = {
    open: "bg-blue-600/20 text-blue-400",
    in_progress: "bg-yellow-600/20 text-yellow-400",
    pending: "bg-orange-600/20 text-orange-400",
    resolved: "bg-green-600/20 text-green-400",
    closed: "bg-slate-600/20 text-slate-400",
  }[status];

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${className}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const className = {
    urgent: "bg-red-600/20 text-red-400",
    high: "bg-orange-600/20 text-orange-400",
    medium: "bg-yellow-600/20 text-yellow-400",
    low: "bg-slate-600/20 text-slate-400",
  }[priority];

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${className}`}>
      {priority}
    </span>
  );
}

const initialMessages: TicketMessage[] = [
  {
    id: "msg-1",
    ticketId: "mock-ticket",
    authorId: "member-1",
    authorName: "Jordan Lee",
    authorRole: "member",
    content:
      "Hi team, I completed my course but my certificate still hasn’t generated on my dashboard.",
    createdAt: "2026-07-05 09:15 AM",
    isInternal: false,
  },
  {
    id: "msg-2",
    ticketId: "mock-ticket",
    authorId: "agent-1",
    authorName: "Ava Learning",
    authorRole: "agent",
    content:
      "Thanks for reporting this. I refreshed your course completion record and the certificate should now be available within the next few minutes.",
    createdAt: "2026-07-05 10:02 AM",
    isInternal: false,
  },
  {
    id: "msg-3",
    ticketId: "mock-ticket",
    authorId: "member-1",
    authorName: "Jordan Lee",
    authorRole: "member",
    content: "I can see it now. Thank you for the quick help!",
    createdAt: "2026-07-05 10:18 AM",
    isInternal: false,
  },
];

export default function SupportTicketDetailPage() {
  const params = useParams<{ id: string }>();
  const ticketId = params.id;
  const [messages, setMessages] = useState<TicketMessage[]>(initialMessages);
  const [reply, setReply] = useState("");
  const [rating, setRating] = useState(0);

  const ticket = useMemo(
    () => ({
      id: ticketId,
      subject: "Certificate not generated after course completion",
      status: "resolved" as TicketStatus,
      priority: "high" as TicketPriority,
      category: "Course",
      createdAt: "2026-07-05",
      updatedAt: "2026-07-05",
      assignedTo: "Ava Learning",
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
        id: `msg-${currentMessages.length + 1}`,
        ticketId,
        authorId: "member-1",
        authorName: "Jordan Lee",
        authorRole: "member",
        content,
        createdAt: new Date().toLocaleString(),
        isInternal: false,
      },
    ]);
    setReply("");
  };

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,2fr)_360px]">
          <div>
            <div className="rounded-xl bg-slate-900 p-8 border border-white/10">
              <p className="text-yellow-400 uppercase tracking-[0.45em] font-bold text-sm">
                TICKET DETAIL
              </p>
              <h1 className="mt-6 text-5xl font-black">{ticket.subject}</h1>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
                <span>Category: {ticket.category}</span>
                <span>Created: {ticket.createdAt}</span>
              </div>
            </div>

            <section className="mt-8 rounded-xl bg-slate-900 p-8 border border-white/10">
              <h2 className="text-3xl font-black">Conversation</h2>
              <div className="mt-8 space-y-4">
                {messages.map((message) => {
                  const isAgent = message.authorRole === "agent";

                  return (
                    <article
                      key={message.id}
                      className={`max-w-3xl rounded-xl border p-5 ${
                        isAgent
                          ? "ml-auto border-blue-500/40 bg-blue-600/10"
                          : "border-white/10 bg-[#101a2f]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-bold text-white">{message.authorName}</p>
                        <p className="text-sm text-slate-400">{message.createdAt}</p>
                      </div>
                      <p className="mt-3 text-slate-300">{message.content}</p>
                    </article>
                  );
                })}
              </div>

              <div className="mt-8">
                <label htmlFor="reply" className="text-sm font-bold text-slate-300 mb-2 block">
                  Reply to support
                </label>
                <textarea
                  id="reply"
                  rows={5}
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  className="rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white focus:border-blue-500 focus:outline-none w-full"
                  placeholder="Add more details or respond to the latest update."
                />
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-400">
                    Need urgent help? Call us at 1-800-EDUNANCIAL
                  </p>
                  <button
                    type="button"
                    onClick={handleSend}
                    className="rounded-lg bg-blue-600 px-5 py-3 font-bold hover:bg-blue-500"
                  >
                    Send
                  </button>
                </div>
              </div>
            </section>

            {ticket.status === "resolved" ? (
              <section className="mt-8 rounded-xl bg-slate-900 p-8 border border-white/10">
                <h2 className="text-2xl font-black">Rate this support</h2>
                <p className="mt-3 text-slate-300">
                  Let us know how helpful this resolution was.
                </p>
                <div className="mt-6 flex gap-3">
                  {Array.from({ length: 5 }, (_, index) => {
                    const starValue = index + 1;
                    const isActive = starValue <= rating;

                    return (
                      <button
                        key={starValue}
                        type="button"
                        aria-label={`Rate support ${starValue} star${starValue === 1 ? "" : "s"}`}
                        onClick={() => setRating(starValue)}
                        className={`text-3xl transition ${isActive ? "text-yellow-400" : "text-slate-500 hover:text-yellow-300"}`}
                      >
                        ★
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="rounded-xl bg-slate-900 p-8 border border-white/10 h-fit">
            <h2 className="text-2xl font-black">Ticket info</h2>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="text-slate-400">ID</dt>
                <dd className="mt-1 font-bold text-white">{ticket.id}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Status</dt>
                <dd className="mt-2"><StatusBadge status={ticket.status} /></dd>
              </div>
              <div>
                <dt className="text-slate-400">Priority</dt>
                <dd className="mt-2"><PriorityBadge priority={ticket.priority} /></dd>
              </div>
              <div>
                <dt className="text-slate-400">Assigned to</dt>
                <dd className="mt-1 font-bold text-white">{ticket.assignedTo}</dd>
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
      </section>
    </main>
  );
}
