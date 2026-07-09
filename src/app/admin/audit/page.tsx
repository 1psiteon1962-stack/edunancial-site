"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import DataTable, { type Column } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import ExportButton from "@/components/admin/ExportButton";
import { adminDataService, type AuditFilters } from "@/lib/admin/dataService";
import type { AuditLog } from "@/lib/admin/types";

const SEVERITY_BORDER: Record<AuditLog["severity"], string> = {
  critical: "border-l-4 border-l-red-500",
  warning: "border-l-4 border-l-yellow-500",
  info: "border-l-4 border-l-blue-500",
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AuditFilters>({});
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("all");
  const [category, setCategory] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState<AuditLog | null>(null);

  async function load(currentFilters: AuditFilters = filters) {
    setLoading(true);
    const result = await adminDataService.audit.list(currentFilters);
    setLogs(result);
    setLoading(false);
  }

  useEffect(() => {
    load({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyFilters(next: AuditFilters) {
    const merged = { ...filters, ...next };
    setFilters(merged);
    load(merged);
  }

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    return {
      today: logs.filter((l) => new Date(l.timestamp).toDateString() === today).length,
      critical: logs.filter((l) => l.severity === "critical").length,
      warning: logs.filter((l) => l.severity === "warning").length,
      system: logs.filter((l) => l.category === "system").length,
    };
  }, [logs]);

  const columns: Column<AuditLog>[] = [
    {
      key: "timestamp",
      label: "Timestamp",
      sortable: true,
      render: (v) => new Date(String(v)).toLocaleString(),
    },
    {
      key: "adminName",
      label: "Admin",
      sortable: true,
      render: (_v, row) => (
        <div>
          <div className="font-semibold text-white">{row.adminName}</div>
          <div className="text-xs text-gray-500">{row.adminEmail}</div>
        </div>
      ),
    },
    { key: "category", label: "Category", sortable: true, render: (v) => <StatusBadge status={String(v)} size="sm" /> },
    { key: "action", label: "Action", sortable: true },
    { key: "resource", label: "Resource", sortable: true, render: (v) => <span className="capitalize">{String(v)}</span> },
    { key: "severity", label: "Severity", sortable: true, render: (v) => <StatusBadge status={String(v)} size="sm" /> },
    { key: "ipAddress", label: "IP Address" },
    {
      key: "details",
      label: "Details",
      render: (v) => <span className="line-clamp-1 max-w-[220px] truncate">{String(v)}</span>,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Audit Log"
        description="Track every administrative action across the Edunancial platform for compliance and security."
        actions={
          <ExportButton
            label="Export Logs"
            filename="edunancial-audit-log.csv"
            onExport={() => adminDataService.audit.export(filters)}
          />
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Events Today" value={stats.today} />
        <StatCard title="Critical Events" value={stats.critical} />
        <StatCard title="Warning Events" value={stats.warning} />
        <StatCard title="System Events" value={stats.system} />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#101a2f] p-4 lg:flex-row lg:flex-wrap lg:items-center">
        <div className="flex-1 min-w-[220px]">
          <label htmlFor="audit-search" className="sr-only">Search audit log</label>
          <input
            id="audit-search"
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              applyFilters({ search: e.target.value });
            }}
            placeholder="Search by admin, action, or resource…"
            className="w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="audit-severity" className="sr-only">Severity</label>
          <select
            id="audit-severity"
            value={severity}
            onChange={(e) => {
              setSeverity(e.target.value);
              applyFilters({ severity: e.target.value });
            }}
            className="rounded-xl border border-white/10 bg-[#08101f] px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label htmlFor="audit-category" className="sr-only">Category</label>
          <select
            id="audit-category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              applyFilters({ category: e.target.value });
            }}
            className="rounded-xl border border-white/10 bg-[#08101f] px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="content">Content</option>
            <option value="user">User</option>
            <option value="permission">Permission</option>
            <option value="billing">Billing</option>
            <option value="system">System</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="audit-from" className="text-xs font-bold text-gray-400">From</label>
          <input
            id="audit-from"
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              applyFilters({ from: e.target.value });
            }}
            className="rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
          />
          <label htmlFor="audit-to" className="text-xs font-bold text-gray-400">To</label>
          <input
            id="audit-to"
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              applyFilters({ to: e.target.value });
            }}
            className="rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading audit log…</p>
      ) : (
        <DataTable columns={columns} data={logs} onRowClick={(row) => setSelected(row)} />
      )}

      {selected && (
        <div className="fixed inset-0 z-[90] flex justify-end">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSelected(null)} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="audit-details-title"
            className={`relative z-10 h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-[#0b1526] p-6 ${SEVERITY_BORDER[selected.severity]}`}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close audit details"
              className="absolute right-4 top-4 rounded-lg border border-white/10 p-2 text-gray-300 hover:bg-white/5"
            >
              ✕
            </button>

            <h2 id="audit-details-title" className="text-xl font-black text-white">Event Details</h2>

            <div className="mt-4 flex gap-2">
              <StatusBadge status={selected.severity} />
              <StatusBadge status={selected.category} />
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Admin</dt>
                <dd className="font-semibold text-white">{selected.adminName} ({selected.adminEmail})</dd>
              </div>
              <div>
                <dt className="text-gray-500">Action</dt>
                <dd className="font-semibold text-white">{selected.action}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Resource</dt>
                <dd className="font-semibold capitalize text-white">{selected.resource} ({selected.resourceId})</dd>
              </div>
              <div>
                <dt className="text-gray-500">Details</dt>
                <dd className="text-gray-300">{selected.details}</dd>
              </div>
              <div>
                <dt className="text-gray-500">IP Address</dt>
                <dd className="font-mono text-gray-300">{selected.ipAddress}</dd>
              </div>
              <div>
                <dt className="text-gray-500">User Agent</dt>
                <dd className="break-all text-xs text-gray-400">{selected.userAgent}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Timestamp</dt>
                <dd className="text-gray-300">{new Date(selected.timestamp).toLocaleString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
