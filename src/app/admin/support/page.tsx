"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type {
  SupportMetrics,
  Ticket,
  TicketPriority,
  TicketStatus,
} from "@/types/support";

const metrics: SupportMetrics = {
  openTickets: 23,
  avgResponseTime: "2.4h",
  satisfactionScore: 4.6,
  resolvedToday: 8,
  pendingEscalations: 2,
};

const mockTickets: Ticket[] = [
  {
    id: "TKT-1001",
    subject: "Unable to access Budgeting Basics after upgrade",
    description: "Member upgraded but course access did not refresh.",
    category: "Membership",
    priority: "high",
    status: "open",
    createdAt: "2026-07-09 08:15 AM",
    updatedAt: "2026-07-09 08:45 AM",
    memberId: "mem-101",
    memberName: "Olivia Carter",
    memberEmail: "olivia.carter@example.com",
    assignedTo: "Sarah J.",
    attachments: [],
    internalNotes: ["Membership refresh requested."],
  },
  {
    id: "TKT-1002",
    subject: "Receipt missing for annual membership renewal",
    description: "Member needs a receipt for reimbursement.",
    category: "Billing",
    priority: "medium",
    status: "pending",
    createdAt: "2026-07-09 07:40 AM",
    updatedAt: "2026-07-09 09:00 AM",
    memberId: "mem-102",
    memberName: "Marcus Green",
    memberEmail: "marcus.green@example.com",
    assignedTo: "Mike R.",
    attachments: ["invoice-request.pdf"],
    internalNotes: [],
  },
  {
    id: "TKT-1003",
    subject: "Progress tracker stuck at 83% in Investing 101",
    description: "Completion progress is not updating after lessons.",
    category: "Technical",
    priority: "urgent",
    status: "in_progress",
    createdAt: "2026-07-09 06:55 AM",
    updatedAt: "2026-07-09 09:12 AM",
    memberId: "mem-103",
    memberName: "Jasmine Patel",
    memberEmail: "jasmine.patel@example.com",
    assignedTo: "Alex T.",
    attachments: ["progress-screenshot.png"],
    internalNotes: ["Engineering escalation opened."],
  },
  {
    id: "TKT-1004",
    subject: "Question about family membership pricing",
    description: "Member needs clarification before checkout.",
    category: "General",
    priority: "low",
    status: "closed",
    createdAt: "2026-07-08 04:20 PM",
    updatedAt: "2026-07-08 05:10 PM",
    memberId: "mem-104",
    memberName: "Daniel Brooks",
    memberEmail: "daniel.brooks@example.com",
    attachments: [],
    internalNotes: [],
    satisfactionRating: 5,
    resolvedAt: "2026-07-08 04:58 PM",
  },
  {
    id: "TKT-1005",
    subject: "Certificate name needs correction",
    description: "Member legal name update not reflected on certificate.",
    category: "Course",
    priority: "medium",
    status: "resolved",
    createdAt: "2026-07-08 01:05 PM",
    updatedAt: "2026-07-09 08:05 AM",
    memberId: "mem-105",
    memberName: "Sofia Ramirez",
    memberEmail: "sofia.ramirez@example.com",
    assignedTo: "Sarah J.",
    attachments: [],
    internalNotes: ["Verified updated profile name."],
    satisfactionRating: 4,
    resolvedAt: "2026-07-09 08:05 AM",
  },
  {
    id: "TKT-1006",
    subject: "Refund request for duplicate payment",
    description: "Member was charged twice during checkout.",
    category: "Billing",
    priority: "urgent",
    status: "open",
    createdAt: "2026-07-09 09:05 AM",
    updatedAt: "2026-07-09 09:14 AM",
    memberId: "mem-106",
    memberName: "Ethan Walker",
    memberEmail: "ethan.walker@example.com",
    attachments: ["bank-statement.png"],
    internalNotes: ["Urgent billing review pending."],
  },
  {
    id: "TKT-1007",
    subject: "Need help resetting two-factor authentication",
    description: "Member lost access to previous phone.",
    category: "Account",
    priority: "high",
    status: "in_progress",
    createdAt: "2026-07-08 11:30 AM",
    updatedAt: "2026-07-09 07:52 AM",
    memberId: "mem-107",
    memberName: "Priya Nair",
    memberEmail: "priya.nair@example.com",
    assignedTo: "Mike R.",
    attachments: [],
    internalNotes: ["Identity verification requested."],
  },
  {
    id: "TKT-1008",
    subject: "Privacy request to export account data",
    description: "Member requested a full export of stored learning data.",
    category: "Privacy",
    priority: "medium",
    status: "pending",
    createdAt: "2026-07-07 03:45 PM",
    updatedAt: "2026-07-09 08:20 AM",
    memberId: "mem-108",
    memberName: "Noah Kim",
    memberEmail: "noah.kim@example.com",
    assignedTo: "Alex T.",
    attachments: [],
    internalNotes: ["Awaiting compliance approval."],
  },
  {
    id: "TKT-1009",
    subject: "Mobile app crashes during quiz review",
    description: "Crash occurs after completing module quizzes.",
    category: "Technical",
    priority: "high",
    status: "open",
    createdAt: "2026-07-09 05:50 AM",
    updatedAt: "2026-07-09 06:25 AM",
    memberId: "mem-109",
    memberName: "Ava Thompson",
    memberEmail: "ava.thompson@example.com",
    attachments: ["crash-log.txt"],
    internalNotes: [],
  },
  {
    id: "TKT-1010",
    subject: "Scholarship application confirmation not received",
    description: "Member wants proof that their application was submitted.",
    category: "Other",
    priority: "low",
    status: "resolved",
    createdAt: "2026-07-08 10:10 AM",
    updatedAt: "2026-07-09 07:15 AM",
    memberId: "mem-110",
    memberName: "Liam Foster",
    memberEmail: "liam.foster@example.com",
    assignedTo: "Sarah J.",
    attachments: [],
    internalNotes: [],
    satisfactionRating: 5,
    resolvedAt: "2026-07-09 07:15 AM",
  },
];

const statusTabs: { label: string; value: TicketStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Pending", value: "pending" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

const agentOptions = ["", "Sarah J.", "Mike R.", "Alex T."] as const;

const satisfactionBreakdown = [
  { rating: 5, percent: 78 },
  { rating: 4, percent: 56 },
  { rating: 3, percent: 24 },
  { rating: 2, percent: 10 },
  { rating: 1, percent: 4 },
];

const responseTimes: { priority: TicketPriority; time: string }[] = [
  { priority: "urgent", time: "12m" },
  { priority: "high", time: "45m" },
  { priority: "medium", time: "2.1h" },
  { priority: "low", time: "6.3h" },
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

export default function AdminSupportDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState<TicketStatus | "all">("all");
  const [assignments, setAssignments] = useState<Record<string, string>>(
    Object.fromEntries(mockTickets.map((ticket) => [ticket.id, ticket.assignedTo ?? ""])),
  );

  const filteredTickets = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return mockTickets.filter((ticket) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        ticket.subject.toLowerCase().includes(normalizedQuery) ||
        ticket.memberName.toLowerCase().includes(normalizedQuery);
      const matchesStatus = activeStatus === "all" || ticket.status === activeStatus;

      return matchesSearch && matchesStatus;
    });
  }, [activeStatus, searchQuery]);

  return (
    <main className="min-h-screen bg-[#08101f] p-10 text-white">
      <div className="space-y-10">
        <section>
          <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
            SUPPORT OPERATIONS
          </p>
          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-5xl font-black">Support Dashboard</h1>
              <p className="mt-4 max-w-3xl text-slate-300">
                Monitor the ticket queue, response performance, and member
                satisfaction across the support team.
              </p>
            </div>
            <Link
              href="/admin"
              className="rounded-lg border border-white/10 px-5 py-3 font-bold transition hover:border-blue-500"
            >
              Back to admin portal
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl border border-white/10 bg-slate-900 p-8">
            <p className="text-sm text-slate-400">Open Tickets</p>
            <p className="mt-4 text-4xl font-black">{metrics.openTickets}</p>
            <p className="mt-3 text-sm text-slate-300">
              {metrics.pendingEscalations} pending escalations
            </p>
          </article>
          <article className="rounded-xl border border-white/10 bg-slate-900 p-8">
            <p className="text-sm text-slate-400">Avg Response Time</p>
            <p className="mt-4 text-4xl font-black">{metrics.avgResponseTime}</p>
            <p className="mt-3 text-sm text-slate-300">Across all active tickets</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-slate-900 p-8">
            <p className="text-sm text-slate-400">Satisfaction Score</p>
            <p className="mt-4 text-4xl font-black">{metrics.satisfactionScore}/5</p>
            <p className="mt-3 text-sm text-slate-300">Based on recent ticket surveys</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-slate-900 p-8">
            <p className="text-sm text-slate-400">Resolved Today</p>
            <p className="mt-4 text-4xl font-black">{metrics.resolvedToday}</p>
            <p className="mt-3 text-sm text-slate-300">Tickets closed in the last 24 hours</p>
          </article>
        </section>

        <section className="rounded-xl border border-white/10 bg-[#101a2f] p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="w-full max-w-xl">
              <label htmlFor="ticket-search" className="mb-2 block text-sm font-bold text-slate-300">
                Search tickets
              </label>
              <input
                id="ticket-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by member or subject"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <nav aria-label="Ticket status filters" className="flex flex-wrap gap-3">
              {statusTabs.map((tab) => {
                const isActive = tab.value === activeStatus;

                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setActiveStatus(tab.value)}
                    className={`rounded-lg px-4 py-2 font-bold transition ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "border border-white/10 text-slate-300 hover:border-blue-500"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm uppercase tracking-wide text-slate-400">
                  <th scope="col" className="px-4 py-2 font-bold">ID</th>
                  <th scope="col" className="px-4 py-2 font-bold">Member</th>
                  <th scope="col" className="px-4 py-2 font-bold">Subject</th>
                  <th scope="col" className="px-4 py-2 font-bold">Category</th>
                  <th scope="col" className="px-4 py-2 font-bold">Priority</th>
                  <th scope="col" className="px-4 py-2 font-bold">Status</th>
                  <th scope="col" className="px-4 py-2 font-bold">Assigned To</th>
                  <th scope="col" className="px-4 py-2 font-bold">Created</th>
                  <th scope="col" className="px-4 py-2 font-bold">View</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="rounded-xl bg-slate-900">
                    <th
                      scope="row"
                      className="rounded-l-xl border-y border-l border-white/10 px-4 py-4 text-sm font-bold text-white"
                    >
                      {ticket.id}
                    </th>
                    <td className="border-y border-white/10 px-4 py-4">
                      <div>
                        <p className="font-bold text-white">{ticket.memberName}</p>
                        <p className="mt-1 text-sm text-slate-400">{ticket.memberEmail}</p>
                      </div>
                    </td>
                    <td className="border-y border-white/10 px-4 py-4 text-slate-300">
                      {ticket.subject}
                    </td>
                    <td className="border-y border-white/10 px-4 py-4 text-slate-300">
                      {ticket.category}
                    </td>
                    <td className="border-y border-white/10 px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getPriorityBadgeClass(ticket.priority)}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="border-y border-white/10 px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusBadgeClass(ticket.status)}`}
                      >
                        {formatStatus(ticket.status)}
                      </span>
                    </td>
                    <td className="border-y border-white/10 px-4 py-4">
                      <select
                        aria-label={`Assign ${ticket.id}`}
                        value={assignments[ticket.id] ?? ""}
                        onChange={(event) =>
                          setAssignments((currentAssignments) => ({
                            ...currentAssignments,
                            [ticket.id]: event.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                      >
                        {agentOptions.map((agent) => (
                          <option key={agent || "unassigned"} value={agent}>
                            {agent || "Unassigned"}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border-y border-white/10 px-4 py-4 text-sm text-slate-300">
                      {ticket.createdAt}
                    </td>
                    <td className="rounded-r-xl border-y border-r border-white/10 px-4 py-4">
                      <Link
                        href={`/admin/support/tickets/${ticket.id}`}
                        className="inline-flex rounded-lg bg-blue-600 px-4 py-2 font-bold text-white transition hover:bg-blue-500"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTickets.length === 0 ? (
              <div className="mt-4 rounded-xl border border-white/10 bg-slate-900 p-6 text-slate-300">
                No tickets match the current search and filter selection.
              </div>
            ) : null}
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-2">
          <article className="rounded-xl border border-white/10 bg-slate-900 p-8">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
              SATISFACTION METRICS
            </p>
            <h2 className="mt-6 text-3xl font-black">Member rating distribution</h2>
            <div className="mt-8 space-y-4">
              {satisfactionBreakdown.map((item) => (
                <div key={item.rating} className="grid grid-cols-[80px_minmax(0,1fr)_60px] items-center gap-4">
                  <span className="text-sm font-bold text-slate-300">{item.rating} stars</span>
                  <div className="h-3 rounded-full bg-slate-800">
                    <div
                      className="h-3 rounded-full bg-blue-600"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                  <span className="text-right text-sm text-slate-400">{item.percent}%</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-white/10 bg-slate-900 p-8">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
              RESPONSE TIME TRACKING
            </p>
            <h2 className="mt-6 text-3xl font-black">Average response by priority</h2>
            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left text-sm uppercase tracking-wide text-slate-400">
                    <th scope="col" className="pb-4 font-bold">Priority</th>
                    <th scope="col" className="pb-4 font-bold">Average Response Time</th>
                  </tr>
                </thead>
                <tbody>
                  {responseTimes.map((item) => (
                    <tr key={item.priority} className="border-b border-white/10 last:border-b-0">
                      <th scope="row" className="py-4 font-bold text-white">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getPriorityBadgeClass(item.priority)}`}
                        >
                          {item.priority}
                        </span>
                      </th>
                      <td className="py-4 text-slate-300">{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
