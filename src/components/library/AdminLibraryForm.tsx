"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LibraryItem, LibraryItemFormData } from "@/lib/library/libraryTypes";

interface AdminLibraryFormProps {
  initialData?: Partial<LibraryItemFormData>;
  itemId?: string; // if provided, PATCH; otherwise POST
}

const TYPES = ["book", "audiobook", "pdf", "epub", "video"] as const;
const ACCESS_LEVELS = ["free", "paid", "membership"] as const;
const STATUSES = ["draft", "published", "archived"] as const;

const CATEGORIES = [
  "foundations",
  "business",
  "personal-finance",
  "real-estate",
  "investing",
  "entrepreneurship",
  "family-finance",
  "teen-finance",
  "credit-debt",
  "wealth-building",
] as const;

const EMPTY: LibraryItemFormData = {
  type: "book",
  title: "",
  author: "",
  description: "",
  longDescription: "",
  categories: [],
  tags: "",
  coverImage: "",
  status: "draft",
  accessLevel: "free",
  price: "",
  downloadable: false,
  fileFormat: "",
  mediaUrl: "",
  downloadUrl: "",
  previewUrl: "",
  language: "en",
  durationMinutes: "",
  pageCount: "",
  narrator: "",
};

export default function AdminLibraryForm({ initialData, itemId }: AdminLibraryFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<LibraryItemFormData>({ ...EMPTY, ...initialData });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function set(field: keyof LibraryItemFormData, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleCategory(cat: string) {
    const has = form.categories.includes(cat as never);
    set(
      "categories",
      has
        ? form.categories.filter((c) => c !== cat)
        : [...form.categories, cat]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      price: form.price ? parseFloat(form.price) : undefined,
      pageCount: form.pageCount ? parseInt(form.pageCount, 10) : undefined,
      durationMinutes: form.durationMinutes
        ? parseInt(form.durationMinutes, 10)
        : undefined,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const url = itemId ? `/api/admin/library/${itemId}` : "/api/admin/library";
    const method = itemId ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Save failed.");
      } else {
        setSuccess(itemId ? "Changes saved!" : "Item created!");
        if (!itemId) {
          setTimeout(() => router.push("/admin/library"), 1500);
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full rounded-lg bg-[#0e1726] border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none";
  const labelCls = "block text-sm font-semibold text-slate-300 mb-1";
  const sectionCls = "rounded-xl bg-[#101a2f] border border-white/10 p-6 space-y-5";

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>

      {/* Identity */}
      <div className={sectionCls}>
        <h2 className="text-xl font-bold">Content Identity</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="type" className={labelCls}>Content Type *</label>
            <select id="type" value={form.type} onChange={(e) => set("type", e.target.value)} className={inputCls} required>
              {TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="language" className={labelCls}>Language</label>
            <input id="language" value={form.language} onChange={(e) => set("language", e.target.value)} className={inputCls} placeholder="en" />
          </div>
        </div>

        <div>
          <label htmlFor="title" className={labelCls}>Title *</label>
          <input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} placeholder="Item title" required />
        </div>

        <div>
          <label htmlFor="author" className={labelCls}>Author *</label>
          <input id="author" value={form.author} onChange={(e) => set("author", e.target.value)} className={inputCls} placeholder="Author name" required />
        </div>

        {form.type === "audiobook" && (
          <div>
            <label htmlFor="narrator" className={labelCls}>Narrator</label>
            <input id="narrator" value={form.narrator} onChange={(e) => set("narrator", e.target.value)} className={inputCls} placeholder="Narrator name" />
          </div>
        )}

        <div>
          <label htmlFor="description" className={labelCls}>Short Description *</label>
          <textarea id="description" value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className={inputCls} placeholder="One-paragraph summary" required />
        </div>

        <div>
          <label htmlFor="longDescription" className={labelCls}>Full Description</label>
          <textarea id="longDescription" value={form.longDescription} onChange={(e) => set("longDescription", e.target.value)} rows={5} className={inputCls} placeholder="Detailed description shown on item detail page" />
        </div>
      </div>

      {/* Categorization */}
      <div className={sectionCls}>
        <h2 className="text-xl font-bold">Categorization</h2>

        <div>
          <p className={labelCls}>Categories</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  form.categories.includes(cat as never)
                    ? "bg-blue-600 text-white"
                    : "bg-[#0e1726] border border-white/10 text-slate-300 hover:border-blue-500"
                }`}
                aria-pressed={form.categories.includes(cat as never)}
              >
                {cat.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="tags" className={labelCls}>Tags <span className="text-slate-500 font-normal">(comma-separated)</span></label>
          <input id="tags" value={form.tags} onChange={(e) => set("tags", e.target.value)} className={inputCls} placeholder="budgeting, personal finance, foundations" />
        </div>

        <div>
          <label htmlFor="coverImage" className={labelCls}>Cover Image URL</label>
          <input id="coverImage" value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} className={inputCls} placeholder="/library/covers/my-book.jpg" />
        </div>
      </div>

      {/* Access & Pricing */}
      <div className={sectionCls}>
        <h2 className="text-xl font-bold">Access & Pricing</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="accessLevel" className={labelCls}>Access Level *</label>
            <select id="accessLevel" value={form.accessLevel} onChange={(e) => set("accessLevel", e.target.value)} className={inputCls} required>
              {ACCESS_LEVELS.map((a) => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
            </select>
          </div>

          {form.accessLevel === "paid" && (
            <div>
              <label htmlFor="price" className={labelCls}>Price ($)</label>
              <input id="price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} className={inputCls} placeholder="9.99" />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="status" className={labelCls}>Status</label>
          <select id="status" value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
            {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* Media */}
      <div className={sectionCls}>
        <h2 className="text-xl font-bold">Media & Files</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="downloadable-check">Downloadable</label>
            <div className="flex items-center gap-3 mt-1">
              <input
                id="downloadable-check"
                type="checkbox"
                checked={form.downloadable}
                onChange={(e) => set("downloadable", e.target.checked)}
                className="w-5 h-5 accent-blue-600"
              />
              <span className="text-slate-300 text-sm">Allow users to download this item</span>
            </div>
          </div>

          {form.downloadable && (
            <div>
              <label htmlFor="fileFormat" className={labelCls}>File Format</label>
              <input id="fileFormat" value={form.fileFormat} onChange={(e) => set("fileFormat", e.target.value)} className={inputCls} placeholder="epub, pdf, mp3, mp4" />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="previewUrl" className={labelCls}>Preview URL <span className="text-slate-500 font-normal">(free sample/trailer)</span></label>
          <input id="previewUrl" value={form.previewUrl} onChange={(e) => set("previewUrl", e.target.value)} className={inputCls} placeholder="https://..." />
        </div>

        <div>
          <label htmlFor="mediaUrl" className={labelCls}>Full Media URL <span className="text-slate-500 font-normal">(entitlement-gated)</span></label>
          <input id="mediaUrl" value={form.mediaUrl} onChange={(e) => set("mediaUrl", e.target.value)} className={inputCls} placeholder="https://..." />
        </div>

        {form.downloadable && (
          <div>
            <label htmlFor="downloadUrl" className={labelCls}>Download URL</label>
            <input id="downloadUrl" value={form.downloadUrl} onChange={(e) => set("downloadUrl", e.target.value)} className={inputCls} placeholder="https://..." />
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {(form.type === "book" || form.type === "pdf" || form.type === "epub") && (
            <div>
              <label htmlFor="pageCount" className={labelCls}>Page Count</label>
              <input id="pageCount" type="number" min="1" value={form.pageCount} onChange={(e) => set("pageCount", e.target.value)} className={inputCls} placeholder="200" />
            </div>
          )}
          {(form.type === "audiobook" || form.type === "video") && (
            <div>
              <label htmlFor="durationMinutes" className={labelCls}>Duration (minutes)</label>
              <input id="durationMinutes" type="number" min="1" value={form.durationMinutes} onChange={(e) => set("durationMinutes", e.target.value)} className={inputCls} placeholder="60" />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-blue-600 px-10 py-4 font-bold hover:bg-blue-500 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {saving ? "Saving…" : itemId ? "Save Changes" : "Create Item"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/library")}
          className="rounded-xl border border-white/20 px-10 py-4 font-bold hover:border-white transition"
        >
          Cancel
        </button>

        {success && <p className="text-green-400 font-semibold">{success}</p>}
        {error && <p role="alert" className="text-red-400">{error}</p>}
      </div>
    </form>
  );
}
