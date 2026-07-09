"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { LibraryItem } from "@/lib/library/libraryTypes";

const TYPE_COLORS: Record<string, string> = {
  book: "text-blue-400",
  audiobook: "text-purple-400",
  pdf: "text-red-400",
  epub: "text-green-400",
  video: "text-yellow-400",
};

export default function AdminLibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/library")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this item? This action cannot be undone.")) return;
    setDeleteId(id);
    await fetch(`/api/admin/library/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteId(null);
  }

  async function toggleStatus(item: LibraryItem) {
    const newStatus = item.status === "published" ? "draft" : "published";
    await fetch(`/api/admin/library/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
    );
  }

  const stats = {
    total: items.length,
    published: items.filter((i) => i.status === "published").length,
    draft: items.filter((i) => i.status === "draft").length,
  };

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
        <div>
          <Link href="/admin" className="text-sm text-slate-400 hover:text-white">
            ← Admin Portal
          </Link>
          <h1 className="mt-4 text-5xl font-black">Library Management</h1>
          <p className="mt-2 text-slate-400">Manage all digital library content</p>
        </div>
        <Link
          href="/admin/library/new"
          className="rounded-xl bg-blue-600 px-8 py-4 font-bold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          + Add New Item
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-10">
        {[
          { label: "Total Items", value: stats.total },
          { label: "Published", value: stats.published, color: "text-green-400" },
          { label: "Draft", value: stats.draft, color: "text-yellow-400" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className={`text-4xl font-black mt-2 ${stat.color ?? ""}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm" aria-label="Library items">
            <thead>
              <tr className="border-b border-white/10 bg-[#101a2f] text-left text-slate-400">
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Access</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Downloads</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{item.author}</p>
                    </div>
                  </td>
                  <td className={`px-4 py-4 uppercase font-semibold text-xs ${TYPE_COLORS[item.type] ?? ""}`}>
                    {item.type}
                  </td>
                  <td className="px-4 py-4 capitalize text-slate-300">
                    {item.accessLevel}
                    {item.price ? ` ($${item.price})` : ""}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleStatus(item)}
                      className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                        item.status === "published"
                          ? "bg-green-800 text-green-200 hover:bg-green-700"
                          : item.status === "draft"
                            ? "bg-yellow-800 text-yellow-200 hover:bg-yellow-700"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                      aria-label={`Toggle status for ${item.title}`}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-slate-300">{item.downloadCount}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-3">
                      <Link
                        href={`/library/${item.id}`}
                        target="_blank"
                        className="text-xs text-blue-400 hover:underline"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/library/${item.id}/edit`}
                        className="text-xs text-yellow-400 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteId === item.id}
                        className="text-xs text-red-400 hover:underline disabled:opacity-50"
                        aria-label={`Delete ${item.title}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
