"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import EmptyState from "./EmptyState";

export interface Column<T> {
  key: string;
  label: string;
  render?: (value: unknown, row: T) => ReactNode;
  sortable?: boolean;
}

export interface RowAction<T> {
  label: string;
  onClick: (row: T) => void;
  hidden?: (row: T) => boolean;
  variant?: "default" | "danger";
}

export interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  actions?: RowAction<T>[];
  emptyTitle?: string;
  emptyDescription?: string;
}

function getValue<T>(row: T, key: string): unknown {
  return (row as unknown as Record<string, unknown>)[key];
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  actions,
  emptyTitle = "No results found",
  emptyDescription = "Try adjusting your search or filters.",
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const av = getValue(a, sortKey);
      const bv = getValue(b, sortKey);
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      const as = String(av ?? "").toLowerCase();
      const bs = String(bv ?? "").toLowerCase();
      if (as < bs) return sortDir === "asc" ? -1 : 1;
      if (as > bs) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [data, sortKey, sortDir]);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#101a2f]">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-gray-400">
            {columns.map((col) => (
              <th key={col.key} scope="col" className="px-4 py-3 font-bold">
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className="flex items-center gap-1 hover:text-white"
                    aria-label={`Sort by ${col.label}`}
                  >
                    {col.label}
                    <span aria-hidden="true" className="text-[10px]">
                      {sortKey === col.key ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </span>
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th scope="col" className="px-4 py-3 font-bold text-right">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-white/5 last:border-0 ${
                onRowClick ? "cursor-pointer hover:bg-white/[0.03]" : ""
              }`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-middle text-gray-200">
                  {col.render ? col.render(getValue(row, col.key), row) : String(getValue(row, col.key) ?? "")}
                </td>
              ))}
              {actions && actions.length > 0 && (
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={openMenuId === row.id}
                      aria-label={`Actions for ${row.id}`}
                      onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)}
                      className="rounded-lg border border-white/10 px-2 py-1 text-gray-300 hover:bg-white/5"
                    >
                      ⋮
                    </button>
                    {openMenuId === row.id && (
                      <div
                        role="menu"
                        className="absolute right-0 z-20 mt-1 w-44 rounded-xl border border-white/10 bg-[#151b2d] py-1 shadow-xl"
                      >
                        {actions
                          .filter((a) => !a.hidden?.(row))
                          .map((action) => (
                            <button
                              key={action.label}
                              role="menuitem"
                              type="button"
                              onClick={() => {
                                action.onClick(row);
                                setOpenMenuId(null);
                              }}
                              className={`block w-full px-3 py-2 text-left text-sm hover:bg-white/5 ${
                                action.variant === "danger" ? "text-red-400" : "text-gray-200"
                              }`}
                            >
                              {action.label}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
