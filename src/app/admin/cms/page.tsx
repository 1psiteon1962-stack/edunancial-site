"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import SearchFilter from "@/components/admin/SearchFilter";
import DataTable, { type Column, type RowAction } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { adminDataService, type ContentFilters } from "@/lib/admin/dataService";
import type { ContentItem } from "@/lib/admin/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const TABS: Array<{ key: string; label: string }> = [
  { key: "all", label: "All" },
  { key: "blog", label: "Blog" },
  { key: "news", label: "News" },
  { key: "faq", label: "FAQs" },
  { key: "landing", label: "Landing Pages" },
  { key: "legal", label: "Legal" },
  { key: "resource", label: "Resources" },
];

interface ContentFormState {
  id?: string;
  type: ContentItem["type"];
  title: string;
  slug: string;
  body: string;
  excerpt: string;
  featuredImage: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  categories: string;
  tags: string;
  status: ContentItem["status"];
  scheduledAt: string;
}

const EMPTY_FORM: ContentFormState = {
  type: "blog",
  title: "",
  slug: "",
  body: "",
  excerpt: "",
  featuredImage: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  categories: "",
  tags: "",
  status: "draft",
  scheduledAt: "",
};

export default function CMSPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState<ContentFilters>({});
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<ContentFormState>(EMPTY_FORM);

  async function load(currentFilters: ContentFilters = filters) {
    setLoading(true);
    const result = await adminDataService.content.list(currentFilters);
    setItems(result);
    setLoading(false);
  }

  useEffect(() => {
    load({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleItems = useMemo(() => {
    if (activeTab === "all") return items;
    return items.filter((i) => i.type === activeTab);
  }, [items, activeTab]);

  function applyFilters(next: ContentFilters) {
    const merged = { ...filters, ...next };
    setFilters(merged);
    load(merged);
  }

  function openCreateForm() {
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEditForm(item: ContentItem) {
    setForm({
      id: item.id,
      type: item.type,
      title: item.title,
      slug: item.slug,
      body: item.body ?? "",
      excerpt: item.excerpt ?? "",
      featuredImage: item.featuredImage ?? "",
      seoTitle: item.seoTitle ?? "",
      seoDescription: item.seoDescription ?? "",
      seoKeywords: (item.seoKeywords ?? []).join(", "),
      categories: item.categories.join(", "),
      tags: item.tags.join(", "),
      status: item.status,
      scheduledAt: item.scheduledAt ? item.scheduledAt.slice(0, 10) : "",
    });
    setFormOpen(true);
  }

  function updateForm(patch: Partial<ContentFormState>) {
    setForm((prev) => {
      const next = { ...prev, ...patch };
      if (patch.title !== undefined && (!prev.id || prev.slug === slugify(prev.title))) {
        next.slug = slugify(patch.title);
      }
      return next;
    });
  }

  async function handleSave(status: ContentItem["status"]) {
    const payload: Partial<ContentItem> = {
      type: form.type,
      title: form.title,
      slug: form.slug || slugify(form.title),
      body: form.body,
      excerpt: form.excerpt,
      featuredImage: form.featuredImage || undefined,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
      seoKeywords: form.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean),
      categories: form.categories.split(",").map((c) => c.trim()).filter(Boolean),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      status,
      scheduledAt: status === "review" && form.scheduledAt ? new Date(form.scheduledAt).toISOString() : undefined,
    };
    if (form.id) {
      await adminDataService.content.update(form.id, payload);
    } else {
      await adminDataService.content.create(payload);
    }
    setFormOpen(false);
    load();
  }

  const columns: Column<ContentItem>[] = [
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (_v, row) => (
        <div>
          <div className="font-semibold text-white">{row.title}</div>
          <div className="text-xs text-gray-500">/{row.slug}</div>
        </div>
      ),
    },
    { key: "type", label: "Type", sortable: true, render: (v) => <StatusBadge status={String(v)} size="sm" /> },
    { key: "author", label: "Author", sortable: true },
    { key: "status", label: "Status", sortable: true, render: (v) => <StatusBadge status={String(v)} size="sm" /> },
    {
      key: "categories",
      label: "Categories",
      render: (v) => (Array.isArray(v) ? v.join(", ") : ""),
    },
    {
      key: "publishedAt",
      label: "Published",
      sortable: true,
      render: (v) => (v ? new Date(String(v)).toLocaleDateString() : "—"),
    },
    { key: "views", label: "Views", sortable: true, render: (v) => Number(v).toLocaleString() },
  ];

  const actions: RowAction<ContentItem>[] = [
    { label: "Edit", onClick: openEditForm },
    {
      label: "Publish",
      hidden: (row) => row.status === "published",
      onClick: async (row) => {
        await adminDataService.content.publish(row.id);
        load();
      },
    },
    {
      label: "Unpublish",
      hidden: (row) => row.status !== "published",
      onClick: async (row) => {
        await adminDataService.content.update(row.id, { status: "draft" });
        load();
      },
    },
    {
      label: "Duplicate",
      onClick: async (row) => {
        await adminDataService.content.create({ ...row, title: `${row.title} (Copy)`, slug: `${row.slug}-copy`, status: "draft" });
        load();
      },
    },
    {
      label: "Archive",
      variant: "danger",
      hidden: (row) => row.status === "archived",
      onClick: async (row) => {
        await adminDataService.content.archive(row.id);
        load();
      },
    },
    { label: "Preview", onClick: (row) => window.open(`/${row.type}/${row.slug}`, "_blank") },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Content Management System"
        description="Manage blog posts, news, FAQs, landing pages, legal documents, and resources."
        actions={
          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500"
          >
            + New Content
          </button>
        }
      />

      <div role="tablist" aria-label="Content types" className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "border border-white/10 text-gray-300 hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <SearchFilter
        placeholder="Search content…"
        onSearch={(q) => applyFilters({ search: q })}
        onFilter={(key, value) => applyFilters({ [key]: value } as ContentFilters)}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { value: "draft", label: "Draft" },
              { value: "review", label: "Review" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" },
            ],
          },
        ]}
      />

      {loading ? (
        <p className="text-gray-400">Loading content…</p>
      ) : (
        <DataTable columns={columns} data={visibleItems} actions={actions} />
      )}

      {formOpen && (
        <div className="fixed inset-0 z-[90] flex justify-end">
          <div className="absolute inset-0 bg-black/70" onClick={() => setFormOpen(false)} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="content-form-title"
            className="relative z-10 h-full w-full max-w-2xl overflow-y-auto border-l border-white/10 bg-[#0b1526] p-6"
          >
            <div className="flex items-center justify-between">
              <h2 id="content-form-title" className="text-xl font-black text-white">
                {form.id ? "Edit Content" : "New Content"}
              </h2>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                aria-label="Close content form"
                className="rounded-lg border border-white/10 p-2 text-gray-300 hover:bg-white/5"
              >
                ✕
              </button>
            </div>

            <form
              className="mt-6 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave(form.status);
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ct-type" className="block text-sm font-bold text-gray-300">
                    Type
                  </label>
                  <select
                    id="ct-type"
                    value={form.type}
                    onChange={(e) => updateForm({ type: e.target.value as ContentItem["type"] })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="blog">Blog</option>
                    <option value="news">News</option>
                    <option value="faq">FAQ</option>
                    <option value="landing">Landing Page</option>
                    <option value="legal">Legal</option>
                    <option value="resource">Resource</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ct-status" className="block text-sm font-bold text-gray-300">
                    Status
                  </label>
                  <select
                    id="ct-status"
                    value={form.status}
                    onChange={(e) => updateForm({ status: e.target.value as ContentItem["status"] })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="review">Review (Scheduled)</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {form.status === "review" && (
                <div>
                  <label htmlFor="ct-scheduled" className="block text-sm font-bold text-gray-300">
                    Scheduled Date
                  </label>
                  <input
                    id="ct-scheduled"
                    type="date"
                    value={form.scheduledAt}
                    onChange={(e) => updateForm({ scheduledAt: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label htmlFor="ct-title" className="block text-sm font-bold text-gray-300">
                  Title
                </label>
                <input
                  id="ct-title"
                  required
                  value={form.title}
                  onChange={(e) => updateForm({ title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="ct-slug" className="block text-sm font-bold text-gray-300">
                  Slug
                </label>
                <input
                  id="ct-slug"
                  value={form.slug}
                  onChange={(e) => updateForm({ slug: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="ct-excerpt" className="block text-sm font-bold text-gray-300">
                  Excerpt
                </label>
                <input
                  id="ct-excerpt"
                  value={form.excerpt}
                  onChange={(e) => updateForm({ excerpt: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="ct-body" className="block text-sm font-bold text-gray-300">
                  Body <span className="font-normal text-gray-500">(Markdown supported)</span>
                </label>
                <textarea
                  id="ct-body"
                  rows={8}
                  value={form.body}
                  onChange={(e) => updateForm({ body: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 font-mono text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="ct-image" className="block text-sm font-bold text-gray-300">
                  Featured Image URL
                </label>
                <input
                  id="ct-image"
                  value={form.featuredImage}
                  onChange={(e) => updateForm({ featuredImage: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <fieldset className="rounded-xl border border-white/10 p-4">
                <legend className="px-2 text-sm font-bold text-gray-300">SEO</legend>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="ct-seo-title" className="block text-sm font-bold text-gray-300">
                      SEO Title
                    </label>
                    <input
                      id="ct-seo-title"
                      value={form.seoTitle}
                      onChange={(e) => updateForm({ seoTitle: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="ct-seo-desc" className="block text-sm font-bold text-gray-300">
                      SEO Description
                    </label>
                    <textarea
                      id="ct-seo-desc"
                      rows={2}
                      value={form.seoDescription}
                      onChange={(e) => updateForm({ seoDescription: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="ct-seo-keywords" className="block text-sm font-bold text-gray-300">
                      SEO Keywords (comma-separated)
                    </label>
                    <input
                      id="ct-seo-keywords"
                      value={form.seoKeywords}
                      onChange={(e) => updateForm({ seoKeywords: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </fieldset>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ct-categories" className="block text-sm font-bold text-gray-300">
                    Categories (comma-separated)
                  </label>
                  <input
                    id="ct-categories"
                    value={form.categories}
                    onChange={(e) => updateForm({ categories: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="ct-tags" className="block text-sm font-bold text-gray-300">
                    Tags (comma-separated)
                  </label>
                  <input
                    id="ct-tags"
                    value={form.tags}
                    onChange={(e) => updateForm({ tags: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSave("draft")}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-gray-200 hover:bg-white/5"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSave("published")}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-500"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
