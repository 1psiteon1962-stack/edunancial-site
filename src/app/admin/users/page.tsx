"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import SearchFilter from "@/components/admin/SearchFilter";
import DataTable, { type Column, type RowAction } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { adminDataService, type MemberFilters } from "@/lib/admin/dataService";
import type { Member } from "@/lib/admin/types";

type PendingAction =
  | { type: "suspend" | "reactivate" | "resetPassword"; member: Member }
  | null;

export default function UserManagementPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MemberFilters>({});
  const [selected, setSelected] = useState<Member | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  async function load(currentFilters: MemberFilters = filters) {
    setLoading(true);
    const result = await adminDataService.members.list(currentFilters);
    setMembers(result);
    setLoading(false);
  }

  useEffect(() => {
    load({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    return {
      total: members.length,
      active: members.filter((m) => m.status === "active").length,
      suspended: members.filter((m) => m.status === "suspended").length,
      newThisMonth: members.filter(
        (m) => new Date(m.joinedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length,
    };
  }, [members]);

  function applyFilters(next: MemberFilters) {
    const merged = { ...filters, ...next };
    setFilters(merged);
    load(merged);
  }

  async function handleConfirm() {
    if (!pendingAction) return;
    const { type, member } = pendingAction;
    if (type === "suspend") await adminDataService.members.suspend(member.id);
    if (type === "reactivate") await adminDataService.members.reactivate(member.id);
    if (type === "resetPassword") await adminDataService.members.resetPassword(member.id);
    await load();
    setPendingAction(null);
  }

  async function handleExport() {
    return adminDataService.members.export(filters);
  }

  function downloadCsv(csv: string) {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "edunancial-users.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const columns: Column<Member>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (_v, row) => (
        <div>
          <div className="font-semibold text-white">{row.name}</div>
          <div className="text-xs text-gray-500">{row.email}</div>
        </div>
      ),
    },
    {
      key: "membershipLevel",
      label: "Membership",
      sortable: true,
      render: (v) => <span className="capitalize">{String(v)}</span>,
    },
    { key: "role", label: "Role", sortable: true, render: (v) => <span className="capitalize">{String(v)}</span> },
    { key: "status", label: "Status", sortable: true, render: (v) => <StatusBadge status={String(v)} size="sm" /> },
    {
      key: "lastLoginAt",
      label: "Last Login",
      sortable: true,
      render: (v) => new Date(String(v)).toLocaleDateString(),
    },
    { key: "coursesEnrolled", label: "Courses", sortable: true },
    {
      key: "totalSpent",
      label: "Total Spent",
      sortable: true,
      render: (v) => `$${Number(v).toLocaleString()}`,
    },
  ];

  const actions: RowAction<Member>[] = [
    { label: "View Profile", onClick: (row) => setSelected(row) },
    {
      label: "Suspend",
      hidden: (row) => row.status === "suspended",
      variant: "danger",
      onClick: (row) => setPendingAction({ type: "suspend", member: row }),
    },
    {
      label: "Reactivate",
      hidden: (row) => row.status !== "suspended",
      onClick: (row) => setPendingAction({ type: "reactivate", member: row }),
    },
    { label: "Reset Password", onClick: (row) => setPendingAction({ type: "resetPassword", member: row }) },
    {
      label: "Edit Role",
      onClick: async (row) => {
        const nextRole = row.role === "member" ? "instructor" : row.role === "instructor" ? "admin" : "member";
        await adminDataService.members.updateRole(row.id, nextRole);
        load();
      },
    },
    {
      label: "Edit Membership",
      onClick: async (row) => {
        const levels = ["free", "basic", "premium", "elite", "enterprise"];
        const nextLevel = levels[(levels.indexOf(row.membershipLevel) + 1) % levels.length];
        await adminDataService.members.updateMembership(row.id, nextLevel);
        load();
      },
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="User Management"
        description="Search, manage, and support every member across the Edunancial platform."
        actions={
          <button
            type="button"
            onClick={() => handleExport().then(downloadCsv)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#101a2f] px-5 py-2.5 text-sm font-bold text-white transition hover:border-blue-500"
          >
            <span aria-hidden="true">⬇</span> Export Users
          </button>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Members" value={stats.total} />
        <StatCard title="Active" value={stats.active} />
        <StatCard title="Suspended" value={stats.suspended} />
        <StatCard title="New This Month" value={stats.newThisMonth} />
      </div>

      <SearchFilter
        placeholder="Search by name or email…"
        onSearch={(q) => applyFilters({ search: q })}
        onFilter={(key, value) => applyFilters({ [key]: value } as MemberFilters)}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { value: "active", label: "Active" },
              { value: "suspended", label: "Suspended" },
              { value: "pending", label: "Pending" },
            ],
          },
          {
            key: "membershipLevel",
            label: "Membership",
            options: [
              { value: "free", label: "Free" },
              { value: "basic", label: "Basic" },
              { value: "premium", label: "Premium" },
              { value: "elite", label: "Elite" },
              { value: "enterprise", label: "Enterprise" },
            ],
          },
          {
            key: "role",
            label: "Role",
            options: [
              { value: "member", label: "Member" },
              { value: "instructor", label: "Instructor" },
              { value: "admin", label: "Admin" },
            ],
          },
        ]}
      />

      {loading ? (
        <p className="text-gray-400">Loading members…</p>
      ) : (
        <DataTable
          columns={columns}
          data={members}
          actions={actions}
          onRowClick={(row) => setSelected(row)}
          emptyTitle="No members match your filters"
          emptyDescription="Try a different search term or reset your filters."
        />
      )}

      {/* Member profile drawer */}
      {selected && (
        <div className="fixed inset-0 z-[90] flex justify-end">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setSelected(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-drawer-title"
            className="relative z-10 h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-[#0b1526] p-6"
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close profile panel"
              className="absolute right-4 top-4 rounded-lg border border-white/10 p-2 text-gray-300 hover:bg-white/5"
            >
              ✕
            </button>

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-black text-white">
                {selected.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h2 id="member-drawer-title" className="text-xl font-black text-white">
                  {selected.name}
                </h2>
                <p className="text-sm text-gray-400">{selected.email}</p>
                {selected.phone && <p className="text-sm text-gray-500">{selected.phone}</p>}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <StatusBadge status={selected.status} />
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold capitalize text-gray-300">
                {selected.membershipLevel} membership
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold capitalize text-gray-300">
                {selected.role}
              </span>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Country</dt>
                <dd className="font-semibold text-white">{selected.country}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Joined</dt>
                <dd className="font-semibold text-white">
                  {new Date(selected.joinedAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Courses Enrolled</dt>
                <dd className="font-semibold text-white">{selected.coursesEnrolled}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Courses Completed</dt>
                <dd className="font-semibold text-white">{selected.coursesCompleted}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Total Spent</dt>
                <dd className="font-semibold text-white">${selected.totalSpent.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Last Login</dt>
                <dd className="font-semibold text-white">
                  {new Date(selected.lastLoginAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>

            <section className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400">
                Login History
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className="flex justify-between rounded-lg bg-white/5 px-3 py-2">
                    <span>Session #{5 - i}</span>
                    <span className="text-gray-500">
                      {new Date(
                        new Date(selected.lastLoginAt).getTime() - i * 5 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400">
                Account Actions
              </h3>
              <div className="mt-3 flex flex-col gap-2">
                {selected.status === "suspended" ? (
                  <button
                    type="button"
                    onClick={() => setPendingAction({ type: "reactivate", member: selected })}
                    className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-500"
                  >
                    Reactivate Account
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPendingAction({ type: "suspend", member: selected })}
                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500"
                  >
                    Suspend Account
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPendingAction({ type: "resetPassword", member: selected })}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-gray-200 hover:bg-white/5"
                >
                  Reset Password
                </button>
              </div>
            </section>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={pendingAction !== null}
        onClose={() => setPendingAction(null)}
        onConfirm={handleConfirm}
        title={
          pendingAction?.type === "suspend"
            ? "Suspend member?"
            : pendingAction?.type === "reactivate"
            ? "Reactivate member?"
            : "Reset password?"
        }
        message={
          pendingAction
            ? `This will ${pendingAction.type === "suspend" ? "suspend" : pendingAction.type === "reactivate" ? "reactivate" : "send a password reset email to"} ${pendingAction.member.name}.`
            : ""
        }
        confirmLabel={
          pendingAction?.type === "suspend"
            ? "Suspend"
            : pendingAction?.type === "reactivate"
            ? "Reactivate"
            : "Send Reset"
        }
        confirmVariant={pendingAction?.type === "suspend" ? "danger" : "primary"}
      />
    </div>
  );
}
