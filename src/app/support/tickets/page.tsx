"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Ticket, TicketPriority, TicketStatus } from "@/types/support";

type TicketFilter = "all" | TicketStatus;

const tickets: Ticket[] = [
  {
    id: "TKT-104821",
    subject: "Can't access course video in Budgeting Basics",
    description: "The lesson spinner never finishes loading on Chrome.",
    category: "Technical",
    priority: "high",
    status: "open",
    createdAt: "2026-07-07",
    updatedAt: "2026-07-08",
    memberId: "mem-1001",
    memberName: "Jordan Lee",
    memberEmail: "jordan@example.com",
    assignedTo: "Maya Support",
    attachments: [],
    internalNotes: [],
  },
  {
    id: "TKT-104579",
    subject: "Billing question about annual renewal",
    description: "Need confirmation before my membership renews next week.",
    category: "Billing",
    priority: "medium",
    status: "in_progress",
    createdAt: "2026-07-06",
    updatedAt: "2026-07-09",
    memberId: "mem-1002",
    memberName: "Alex Carter",
    memberEmail: "alex@example.com",
    assignedTo: "Noah Billing",
    attachments: [],
    internalNotes: [],
  },
  {
    id: "TKT-104330",
    subject: "Certificate not generated after course completion",
    description: "Completed the final quiz but no certificate is showing.",
    category: "Course",
    priority: "high",
    status: "pending",
    createdAt: "2026-07-04",
    updatedAt: "2026-07-08",
    memberId: "mem-1003",
    memberName: "Taylor Nguyen",
    memberEmail: "taylor@example.com",
    assignedTo: "Ava Learning",
    attachments: [],
    internalNotes: [],
  },
  {
    id: "TKT-103998",
    subject: "Refund request for duplicate membership charge",
    description: "Two transactions posted for the same renewal date.",
    category: "Billing",
    priority: "urgent",
    status: "resolved",
    createdAt: "2026-07-02",
    updatedAt: "2026-07-05",
    memberId: "mem-1004",
    memberName: "Morgan Patel",
    memberEmail: "morgan@example.com",
    assignedTo: "Noah Billing",
    attachments: [],
    internalNotes: [],
    satisfactionRating: 5,
    resolvedAt: "2026-07-05",
  },
  {
    id: "TKT-103772",
    subject: "Need help updating my account email",
    description: "The verification email never arrived after I changed it.",
    category: "Account",
    priority: "low",
    status: "closed",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-03",
    memberId: "mem-1005",
    memberName: "Jamie Brooks",
    memberEmail: "jamie@example.com",
    assignedTo: "Chris Account",
    attachments: [],
    internalNotes: [],
  },
  {
    id: "TKT-103411",
    subject: "Privacy request for a copy of my learning data",
    description: "I want to export my account and course activity history.",
    category: "Privacy",
    priority: "medium",
    status: "open",
    createdAt: "2026-06-29",
    updatedAt: "2026-07-07",
    memberId: "mem-1006",
    memberName: "Casey Rivera",
    memberEmail: "casey@example.com",
    attachments: [],
    internalNotes: [],
  },
];

const filterTabs: Array<{ label: string; value: TicketFilter }> = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Pending", value: "pending" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

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

export default function SupportTicketsPage() {
  const [activeFilter, setActiveFilter] = useState<TicketFilter>("all");

  const filteredTickets = useMemo(
    () =>
      activeFilter === "all"
        ? tickets
        : tickets.filter((ticket) => ticket.status === activeFilter),
    [activeFilter],
  );

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-yellow-400 uppercase tracking-[0.45em] font-bold text-sm">
              MY TICKETS
            </p>
            <h1 className="mt-6 text-5xl font-black">Support conversations</h1>
            <p className="mt-4 max-w-3xl text-slate-300">
              Track requests, check status updates, and open a new conversation with
              our support team.
            </p>
          </div>

          <Link
            href="/support/new"
            className="rounded-lg bg-blue-600 px-5 py-3 font-bold hover:bg-blue-500 text-center"
          >
            New Ticket
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {filterTabs.map((tab) => {
            const isActive = tab.value === activeFilter;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveFilter(tab.value)}
                className={
                  isActive
                    ? "rounded-lg bg-blue-600 px-5 py-3 font-bold hover:bg-blue-500"
                    : "rounded-lg border border-white/10 px-5 py-3 font-bold hover:border-blue-500"
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6">
          {filteredTickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/support/tickets/${ticket.id}`}
              className="rounded-xl bg-slate-900 p-8 border border-white/10 transition hover:border-blue-500"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-black">{ticket.subject}</h2>
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                  <p className="mt-4 text-slate-300">{ticket.description}</p>
                </div>

                <div className="text-sm text-slate-400 lg:text-right">
                  <p>{ticket.id}</p>
                  <p className="mt-2">Category: {ticket.category}</p>
                  <p className="mt-2">Updated: {ticket.updatedAt}</p>
                </div>
              </div>
            </Link>
          ))}

          {filteredTickets.length === 0 ? (
            <div className="rounded-xl bg-slate-900 p-8 border border-white/10 text-slate-300">
              No tickets match this status right now.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
