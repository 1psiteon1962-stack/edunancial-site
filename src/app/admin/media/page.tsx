"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import SearchFilter from "@/components/admin/SearchFilter";
import DataTable, { type Column, type RowAction } from "@/components/admin/DataTable";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { adminDataService, type MediaFilters } from "@/lib/admin/dataService";
import type { MediaItem } from "@/lib/admin/types";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const TYPE_ICON: Record<MediaItem["type"], string> = {
  image: "🖼️",
  pdf: "📄",
  video: "🎬",
  audio: "🎵",
  worksheet: "📊",
  other: "📁",
};

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MediaFilters>({});
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  async function load(currentFilters: MediaFilters = filters) {
    setLoading(true);
    const result = await adminDataService.media.list(currentFilters);
    setItems(result);
    setLoading(false);
  }

  useEffect(() => {
    load({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(
    () => ({
      total: items.length,
      images: items.filter((i) => i.type === "image").length,
      videos: items.filter((i) => i.type === "video").length,
      pdfs: items.filter((i) => i.type === "pdf").length,
      totalSize: formatBytes(items.reduce((sum, i) => sum + i.size, 0)),
    }),
    [items]
  );

  function applyFilters(next: MediaFilters) {
    const merged = { ...filters, ...next };
    setFilters(merged);
    load(merged);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await adminDataService.media.delete(deleteTarget.id);
    setDeleteTarget(null);
    setSelected(null);
    load();
  }

  async function handleUpdateSelected(patch: Partial<MediaItem>) {
    if (!selected) return;
    const updated = await adminDataService.media.update(selected.id, patch);
    if (updated) setSelected(updated);
    load();
  }

  const columns: Column<MediaItem>[] = [
    {
      key: "filename",
      label: "Preview",
      render: (_v, row) => (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-lg" aria-hidden="true">
          {TYPE_ICON[row.type]}
        </div>
      ),
    },
    { key: "filename", label: "Filename", sortable: true },
    { key: "type", label: "Type", sortable: true, render: (v) => <span className="capitalize">{String(v)}</span> },
    { key: "size", label: "Size", sortable: true, render: (v) => formatBytes(Number(v)) },
    { key: "uploadedBy", label: "Uploaded By", sortable: true },
    {
      key: "uploadedAt",
      label: "Date",
      sortable: true,
      render: (v) => new Date(String(v)).toLocaleDateString(),
    },
  ];

  const actions: RowAction<MediaItem>[] = [
    { label: "View Details", onClick: (row) => setSelected(row) },
    { label: "Delete", variant: "danger", onClick: (row) => setDeleteTarget(row) },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Media Library"
        description="Manage images, PDFs, videos, audio, and worksheets used across Edunancial."
        actions={
          <button
            type="button"
            onClick={() => setUploadOpen(true)}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500"
          >
            Upload Media
          </button>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Files" value={stats.total} />
        <StatCard title="Images" value={stats.images} />
        <StatCard title="Videos" value={stats.videos} />
        <StatCard title="PDFs" value={stats.pdfs} />
        <StatCard title="Total Size" value={stats.totalSize} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <SearchFilter
            placeholder="Search by filename…"
            onSearch={(q) => applyFilters({ search: q })}
            onFilter={(key, value) => applyFilters({ [key]: value } as MediaFilters)}
            filters={[
              {
                key: "type",
                label: "Type",
                options: [
                  { value: "image", label: "Image" },
                  { value: "pdf", label: "PDF" },
                  { value: "video", label: "Video" },
                  { value: "audio", label: "Audio" },
                  { value: "worksheet", label: "Worksheet" },
                ],
              },
            ]}
          />
        </div>
        <div className="flex gap-2" role="group" aria-label="View mode">
          <button
            type="button"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
            className={`rounded-xl px-4 py-2.5 text-sm font-bold ${
              view === "grid" ? "bg-blue-600 text-white" : "border border-white/10 text-gray-300"
            }`}
          >
            Grid
          </button>
          <button
            type="button"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
            className={`rounded-xl px-4 py-2.5 text-sm font-bold ${
              view === "list" ? "bg-blue-600 text-white" : "border border-white/10 text-gray-300"
            }`}
          >
            List
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading media…</p>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              className="flex flex-col rounded-2xl border border-white/10 bg-[#101a2f] p-4 text-left transition hover:border-blue-500"
            >
              <div className="flex h-28 items-center justify-center rounded-xl bg-white/5 text-4xl" aria-hidden="true">
                {TYPE_ICON[item.type]}
              </div>
              <p className="mt-3 truncate text-sm font-bold text-white">{item.filename}</p>
              <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
                <span className="capitalize">{item.type}</span>
                <span>{formatBytes(item.size)}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {new Date(item.uploadedAt).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={items} actions={actions} onRowClick={(row) => setSelected(row)} />
      )}

      {/* Details panel */}
      {selected && (
        <div className="fixed inset-0 z-[90] flex justify-end">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSelected(null)} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="media-details-title"
            className="relative z-10 h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-[#0b1526] p-6"
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close media details"
              className="absolute right-4 top-4 rounded-lg border border-white/10 p-2 text-gray-300 hover:bg-white/5"
            >
              ✕
            </button>

            <h2 id="media-details-title" className="text-xl font-black text-white">
              Media Details
            </h2>

            <div className="mt-4 flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-white/5">
              {selected.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected.url} alt={selected.altText ?? selected.filename} className="h-full w-full object-cover" />
              ) : (
                <span className="text-6xl" aria-hidden="true">{TYPE_ICON[selected.type]}</span>
              )}
            </div>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Filename</dt>
                <dd className="font-semibold text-white">{selected.filename}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Type</dt>
                <dd className="font-semibold capitalize text-white">{selected.type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Size</dt>
                <dd className="font-semibold text-white">{formatBytes(selected.size)}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-gray-500">URL</dt>
                <dd className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(selected.url)}
                    className="rounded-lg border border-white/10 px-2 py-1 text-xs font-bold text-gray-300 hover:bg-white/5"
                  >
                    Copy URL
                  </button>
                </dd>
              </div>
            </dl>

            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="m-alt" className="block text-sm font-bold text-gray-300">
                  Alt Text
                </label>
                <input
                  id="m-alt"
                  value={selected.altText ?? ""}
                  onChange={(e) => setSelected({ ...selected, altText: e.target.value })}
                  onBlur={(e) => handleUpdateSelected({ altText: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="m-caption" className="block text-sm font-bold text-gray-300">
                  Caption
                </label>
                <input
                  id="m-caption"
                  value={selected.caption ?? ""}
                  onChange={(e) => setSelected({ ...selected, caption: e.target.value })}
                  onBlur={(e) => handleUpdateSelected({ caption: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="m-tags" className="block text-sm font-bold text-gray-300">
                  Tags (comma-separated)
                </label>
                <input
                  id="m-tags"
                  value={selected.tags.join(", ")}
                  onChange={(e) => setSelected({ ...selected, tags: e.target.value.split(",").map((t) => t.trim()) })}
                  onBlur={(e) =>
                    handleUpdateSelected({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
                  }
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <section className="mt-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400">Used In</h3>
              {selected.usedIn.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500">Not currently used anywhere.</p>
              ) : (
                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                  {selected.usedIn.map((usage) => (
                    <li key={usage} className="rounded-lg bg-white/5 px-3 py-2">{usage}</li>
                  ))}
                </ul>
              )}
            </section>

            <button
              type="button"
              onClick={() => setDeleteTarget(selected)}
              className="mt-8 w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500"
            >
              Delete Media
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete media file?"
        message={`"${deleteTarget?.filename}" will be permanently removed from the media library.`}
        confirmLabel="Delete"
        confirmVariant="danger"
      />

      {/* Upload modal (mock) */}
      {uploadOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-modal-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101a2f] p-6"
          >
            <h2 id="upload-modal-title" className="text-xl font-black text-white">
              Upload Media
            </h2>

            {uploadSuccess ? (
              <div className="mt-6 rounded-xl bg-green-500/10 p-4 text-sm font-bold text-green-400">
                ✓ File uploaded successfully.
              </div>
            ) : (
              <form
                className="mt-6 space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await adminDataService.media.upload({
                    filename: "new-upload.jpg",
                    originalName: "new-upload.jpg",
                    type: "image",
                    mimeType: "image/jpeg",
                    size: 245000,
                    url: "https://picsum.photos/seed/new-upload/800/600",
                    uploadedBy: "Admin User",
                  });
                  setUploadSuccess(true);
                  load();
                }}
              >
                <div>
                  <label htmlFor="upload-file" className="block text-sm font-bold text-gray-300">
                    File
                  </label>
                  <input
                    id="upload-file"
                    type="file"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-sm text-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="upload-alt" className="block text-sm font-bold text-gray-300">
                    Alt Text
                  </label>
                  <input
                    id="upload-alt"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadOpen(false);
                      setUploadSuccess(false);
                    }}
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-gray-300 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-500"
                  >
                    Upload
                  </button>
                </div>
              </form>
            )}

            {uploadSuccess && (
              <button
                type="button"
                onClick={() => {
                  setUploadOpen(false);
                  setUploadSuccess(false);
                }}
                className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500"
              >
                Done
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
