"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import SearchFilter from "@/components/admin/SearchFilter";
import DataTable, { type Column, type RowAction } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { adminDataService, type CourseFilters } from "@/lib/admin/dataService";
import type { Course } from "@/lib/admin/types";

const DEFAULT_CATEGORIES = ["Financial Literacy", "Real Estate", "Business", "Investing", "Entrepreneurship"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface CourseFormState {
  id?: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  instructor: string;
  status: Course["status"];
  scheduledAt: string;
  price: number;
  isFree: boolean;
  tags: string;
  thumbnail: string;
  duration: string;
  lessons: number;
}

const EMPTY_FORM: CourseFormState = {
  title: "",
  slug: "",
  description: "",
  category: DEFAULT_CATEGORIES[0],
  instructor: "",
  status: "draft",
  scheduledAt: "",
  price: 0,
  isFree: true,
  tags: "",
  thumbnail: "",
  duration: "",
  lessons: 0,
};

export default function CourseManagementPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CourseFilters>({});
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<CourseFormState>(EMPTY_FORM);
  const [dirty, setDirty] = useState(false);
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<Course | null>(null);

  async function load(currentFilters: CourseFilters = filters) {
    setLoading(true);
    const result = await adminDataService.courses.list(currentFilters);
    setCourses(result);
    setLoading(false);
  }

  useEffect(() => {
    load({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(
    () => ({
      total: courses.length,
      published: courses.filter((c) => c.status === "published").length,
      draft: courses.filter((c) => c.status === "draft").length,
      enrollments: courses.reduce((sum, c) => sum + c.enrollments, 0),
    }),
    [courses]
  );

  function applyFilters(next: CourseFilters) {
    const merged = { ...filters, ...next };
    setFilters(merged);
    load(merged);
  }

  function openCreateForm() {
    setForm(EMPTY_FORM);
    setDirty(false);
    setFormOpen(true);
  }

  function openEditForm(course: Course) {
    setForm({
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      category: course.category,
      instructor: course.instructor,
      status: course.status,
      scheduledAt: course.scheduledAt ? course.scheduledAt.slice(0, 10) : "",
      price: course.price,
      isFree: course.isFree,
      tags: course.tags.join(", "),
      thumbnail: course.thumbnail ?? "",
      duration: course.duration,
      lessons: course.lessons,
    });
    setDirty(false);
    setFormOpen(true);
  }

  function updateForm(patch: Partial<CourseFormState>) {
    setForm((prev) => {
      const next = { ...prev, ...patch };
      if (patch.title !== undefined && (!prev.id || prev.slug === slugify(prev.title))) {
        next.slug = slugify(patch.title);
      }
      return next;
    });
    setDirty(true);
  }

  function requestClose() {
    if (dirty) {
      setDiscardConfirmOpen(true);
    } else {
      setFormOpen(false);
    }
  }

  async function handleSave() {
    const payload: Partial<Course> = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      description: form.description,
      category: form.category,
      instructor: form.instructor,
      status: form.status,
      scheduledAt: form.status === "scheduled" && form.scheduledAt ? new Date(form.scheduledAt).toISOString() : undefined,
      price: form.isFree ? 0 : form.price,
      isFree: form.isFree,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      thumbnail: form.thumbnail || undefined,
      duration: form.duration,
      lessons: form.lessons,
    };
    if (form.id) {
      await adminDataService.courses.update(form.id, payload);
    } else {
      await adminDataService.courses.create(payload);
    }
    setFormOpen(false);
    setDirty(false);
    load();
  }

  const columns: Column<Course>[] = [
    {
      key: "title",
      label: "Course",
      sortable: true,
      render: (_v, row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
            {row.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.thumbnail} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div>
            <div className="font-semibold text-white">{row.title}</div>
            <div className="text-xs text-gray-500">{row.lessons} lessons · {row.duration}</div>
          </div>
        </div>
      ),
    },
    { key: "category", label: "Category", sortable: true },
    { key: "instructor", label: "Instructor", sortable: true },
    { key: "status", label: "Status", sortable: true, render: (v) => <StatusBadge status={String(v)} size="sm" /> },
    { key: "enrollments", label: "Enrollments", sortable: true },
    { key: "completions", label: "Completions", sortable: true },
    { key: "rating", label: "Rating", sortable: true, render: (v) => `⭐ ${v}` },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (_v, row) => (row.isFree ? "Free" : `$${row.price}`),
    },
  ];

  const actions: RowAction<Course>[] = [
    { label: "Edit", onClick: openEditForm },
    {
      label: "Publish",
      hidden: (row) => row.status === "published",
      onClick: async (row) => {
        await adminDataService.courses.publish(row.id);
        load();
      },
    },
    {
      label: "Unpublish",
      hidden: (row) => row.status !== "published",
      onClick: async (row) => {
        await adminDataService.courses.unpublish(row.id);
        load();
      },
    },
    {
      label: "Duplicate",
      onClick: async (row) => {
        await adminDataService.courses.duplicate(row.id);
        load();
      },
    },
    { label: "Archive", variant: "danger", hidden: (row) => row.status === "archived", onClick: (row) => setArchiveTarget(row) },
    { label: "View Live", onClick: (row) => window.open(`/courses/${row.slug}`, "_blank") },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Course Management"
        description="Create, schedule, and manage every course in the Edunancial catalog."
        actions={
          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500"
          >
            + Create Course
          </button>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Courses" value={stats.total} />
        <StatCard title="Published" value={stats.published} />
        <StatCard title="Draft" value={stats.draft} />
        <StatCard title="Total Enrollments" value={stats.enrollments.toLocaleString()} />
      </div>

      <SearchFilter
        placeholder="Search courses…"
        onSearch={(q) => applyFilters({ search: q })}
        onFilter={(key, value) => applyFilters({ [key]: value } as CourseFilters)}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { value: "draft", label: "Draft" },
              { value: "review", label: "Review" },
              { value: "published", label: "Published" },
              { value: "scheduled", label: "Scheduled" },
              { value: "archived", label: "Archived" },
            ],
          },
          {
            key: "category",
            label: "Category",
            options: categories.map((c) => ({ value: c, label: c })),
          },
        ]}
      />

      {loading ? (
        <p className="text-gray-400">Loading courses…</p>
      ) : (
        <DataTable columns={columns} data={courses} actions={actions} />
      )}

      <section className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
        <h2 className="text-xl font-black text-white">Categories</h2>
        <p className="mt-1 text-sm text-gray-400">Manage the categories used across the course catalog.</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <li
              key={cat}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-200"
            >
              {cat}
              <button
                type="button"
                aria-label={`Remove category ${cat}`}
                onClick={() => setCategories((prev) => prev.filter((c) => c !== cat))}
                className="text-gray-500 hover:text-red-400"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <form
          className="mt-4 flex gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (newCategory.trim() && !categories.includes(newCategory.trim())) {
              setCategories((prev) => [...prev, newCategory.trim()]);
              setNewCategory("");
            }
          }}
        >
          <label htmlFor="new-category" className="sr-only">
            New category name
          </label>
          <input
            id="new-category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="flex-1 rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-gray-200 hover:bg-white/5"
          >
            Add Category
          </button>
        </form>
      </section>

      {/* Course form slide-in panel */}
      {formOpen && (
        <div className="fixed inset-0 z-[90] flex justify-end">
          <div className="absolute inset-0 bg-black/70" onClick={requestClose} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-form-title"
            className="relative z-10 h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#0b1526] p-6"
          >
            <div className="flex items-center justify-between">
              <h2 id="course-form-title" className="text-xl font-black text-white">
                {form.id ? "Edit Course" : "Create Course"}
              </h2>
              <button
                type="button"
                onClick={requestClose}
                aria-label="Close course form"
                className="rounded-lg border border-white/10 p-2 text-gray-300 hover:bg-white/5"
              >
                ✕
              </button>
            </div>

            <form
              className="mt-6 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div>
                <label htmlFor="c-title" className="block text-sm font-bold text-gray-300">
                  Title
                </label>
                <input
                  id="c-title"
                  required
                  value={form.title}
                  onChange={(e) => updateForm({ title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="c-slug" className="block text-sm font-bold text-gray-300">
                  Slug
                </label>
                <input
                  id="c-slug"
                  value={form.slug}
                  onChange={(e) => updateForm({ slug: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="c-description" className="block text-sm font-bold text-gray-300">
                  Description
                </label>
                <textarea
                  id="c-description"
                  rows={4}
                  value={form.description}
                  onChange={(e) => updateForm({ description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="c-category" className="block text-sm font-bold text-gray-300">
                    Category
                  </label>
                  <select
                    id="c-category"
                    value={form.category}
                    onChange={(e) => updateForm({ category: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="c-instructor" className="block text-sm font-bold text-gray-300">
                    Instructor
                  </label>
                  <input
                    id="c-instructor"
                    value={form.instructor}
                    onChange={(e) => updateForm({ instructor: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="c-status" className="block text-sm font-bold text-gray-300">
                    Status
                  </label>
                  <select
                    id="c-status"
                    value={form.status}
                    onChange={(e) => updateForm({ status: e.target.value as Course["status"] })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="review">Review</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                {form.status === "scheduled" && (
                  <div>
                    <label htmlFor="c-scheduled" className="block text-sm font-bold text-gray-300">
                      Scheduled Date
                    </label>
                    <input
                      id="c-scheduled"
                      type="date"
                      value={form.scheduledAt}
                      onChange={(e) => updateForm({ scheduledAt: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="c-price" className="block text-sm font-bold text-gray-300">
                    Price ($)
                  </label>
                  <input
                    id="c-price"
                    type="number"
                    min={0}
                    disabled={form.isFree}
                    value={form.price}
                    onChange={(e) => updateForm({ price: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
                <div className="flex items-end gap-2 pb-2">
                  <input
                    id="c-isfree"
                    type="checkbox"
                    checked={form.isFree}
                    onChange={(e) => updateForm({ isFree: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-[#08101f]"
                  />
                  <label htmlFor="c-isfree" className="text-sm font-bold text-gray-300">
                    Free course
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="c-duration" className="block text-sm font-bold text-gray-300">
                    Duration
                  </label>
                  <input
                    id="c-duration"
                    value={form.duration}
                    onChange={(e) => updateForm({ duration: e.target.value })}
                    placeholder="e.g. 4h 30m"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="c-lessons" className="block text-sm font-bold text-gray-300">
                    Lessons
                  </label>
                  <input
                    id="c-lessons"
                    type="number"
                    min={0}
                    value={form.lessons}
                    onChange={(e) => updateForm({ lessons: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="c-thumbnail" className="block text-sm font-bold text-gray-300">
                  Thumbnail URL
                </label>
                <input
                  id="c-thumbnail"
                  value={form.thumbnail}
                  onChange={(e) => updateForm({ thumbnail: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="c-tags" className="block text-sm font-bold text-gray-300">
                  Tags (comma-separated)
                </label>
                <input
                  id="c-tags"
                  value={form.tags}
                  onChange={(e) => updateForm({ tags: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
                {form.tags && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {form.tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                      <span key={tag} className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-gray-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={requestClose}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-500"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={discardConfirmOpen}
        onClose={() => setDiscardConfirmOpen(false)}
        onConfirm={() => setFormOpen(false)}
        title="Discard changes?"
        message="You have unsaved changes to this course. Are you sure you want to discard them?"
        confirmLabel="Discard"
        confirmVariant="danger"
      />

      <ConfirmModal
        isOpen={archiveTarget !== null}
        onClose={() => setArchiveTarget(null)}
        onConfirm={async () => {
          if (archiveTarget) {
            await adminDataService.courses.archive(archiveTarget.id);
            load();
          }
        }}
        title="Archive course?"
        message={`"${archiveTarget?.title}" will be archived and hidden from the live catalog.`}
        confirmLabel="Archive"
        confirmVariant="danger"
      />

      <div className="text-center">
        <Link href="/courses" className="text-sm font-bold text-blue-400 hover:underline">
          View Live Courses →
        </Link>
      </div>
    </div>
  );
}
