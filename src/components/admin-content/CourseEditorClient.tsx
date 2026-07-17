"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { AdminCourse } from "@/lib/admin-content/types";

interface Props {
  initialCourse: AdminCourse;
}

type Tab = "info" | "modules" | "seo" | "publish";

const STATUS_COLORS: Record<string, string> = {
  draft: "text-yellow-300",
  published: "text-green-300",
  archived: "text-slate-400",
};

export default function CourseEditorClient({ initialCourse }: Props) {
  const router = useRouter();
  const [course, setCourse] = useState(initialCourse);
  const [tab, setTab] = useState<Tab>("info");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [addingModule, setAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [addingLesson, setAddingLesson] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");

  useEffect(() => {
    fetch("/api/admin/auth/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setCsrfToken(data.csrfToken ?? ""))
      .catch(() => {});
  }, []);

  function updateField<K extends keyof AdminCourse>(key: K, value: AdminCourse[K]) {
    setCourse((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/admin/courses/${course.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify(course),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Save failed");
        return;
      }

      setCourse(data.course);
      setMessage("Saved successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(status: "draft" | "published" | "archived") {
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/courses/${course.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ ...course, status }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Status change failed");
        return;
      }

      setCourse(data.course);
      setMessage(`Course ${status}`);
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function addModule() {
    if (!newModuleTitle.trim()) return;

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/modules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ title: newModuleTitle }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to add module");
        return;
      }

      setCourse((prev) => ({ ...prev, modules: [...prev.modules, data.module] }));
      setNewModuleTitle("");
      setAddingModule(false);
      setExpandedModule(data.module.id);
    } catch {
      setError("Network error");
    }
  }

  async function addLesson(moduleId: string) {
    if (!newLessonTitle.trim()) return;

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/modules/${moduleId}/lessons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ title: newLessonTitle }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to add lesson");
        return;
      }

      setCourse((prev) => ({
        ...prev,
        modules: prev.modules.map((moduleItem) =>
          moduleItem.id === moduleId
            ? { ...moduleItem, lessons: [...moduleItem.lessons, data.lesson] }
            : moduleItem,
        ),
      }));
      setNewLessonTitle("");
      setAddingLesson(null);
    } catch {
      setError("Network error");
    }
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#08101f]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin/courses")}
              className="text-sm text-slate-400 hover:text-white"
            >
              ← Courses
            </button>
            <span className="text-slate-600">/</span>
            <span className="max-w-xs truncate font-semibold text-white">{course.title}</span>
            <span className={`text-xs font-semibold ${STATUS_COLORS[course.status] ?? ""}`}>
              {course.status}
            </span>
          </div>
          <div className="flex gap-2">
            {message && (
              <span className="rounded-lg bg-green-500/20 px-3 py-1.5 text-xs text-green-300">
                {message}
              </span>
            )}
            {error && (
              <span className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs text-red-300">
                {error}
              </span>
            )}
            <button
              onClick={save}
              disabled={saving}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl gap-1 px-6 pb-2">
          {(["info", "modules", "seo", "publish"] as Tab[]).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize ${
                tab === tabKey ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {tabKey}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {tab === "info" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
              <h2 className="mb-4 text-lg font-bold">Basic Information</h2>
              <div className="space-y-4">
                <Field label="Title">
                  <input
                    className="w-full rounded-xl border border-white/10 bg-[#0a1020] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/60"
                    value={course.title}
                    onChange={(event) => updateField("title", event.target.value)}
                  />
                </Field>
                <Field label="Subtitle">
                  <input
                    className="w-full rounded-xl border border-white/10 bg-[#0a1020] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/60"
                    value={course.subtitle}
                    onChange={(event) => updateField("subtitle", event.target.value)}
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    className="h-28 w-full resize-none rounded-xl border border-white/10 bg-[#0a1020] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/60"
                    value={course.description}
                    onChange={(event) => updateField("description", event.target.value)}
                  />
                </Field>
                <Field label="Instructor Name">
                  <input
                    className="w-full rounded-xl border border-white/10 bg-[#0a1020] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/60"
                    value={course.instructorName}
                    onChange={(event) => updateField("instructorName", event.target.value)}
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
              <h2 className="mb-4 text-lg font-bold">Classification</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Learning Path">
                  <select
                    className="w-full rounded-xl border border-white/10 bg-[#0a1020] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/60"
                    value={course.path}
                    onChange={(event) =>
                      updateField("path", event.target.value as AdminCourse["path"])
                    }
                  >
                    <option value="red">🔴 RED</option>
                    <option value="white">⚪ WHITE</option>
                    <option value="blue">🔵 BLUE</option>
                  </select>
                </Field>
                <Field label="Language">
                  <select
                    className="w-full rounded-xl border border-white/10 bg-[#0a1020] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/60"
                    value={course.language}
                    onChange={(event) =>
                      updateField("language", event.target.value as AdminCourse["language"])
                    }
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="fr-CA">fr-CA</option>
                  </select>
                </Field>
                <Field label="Difficulty">
                  <select
                    className="w-full rounded-xl border border-white/10 bg-[#0a1020] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/60"
                    value={course.difficulty}
                    onChange={(event) =>
                      updateField(
                        "difficulty",
                        event.target.value as AdminCourse["difficulty"],
                      )
                    }
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </Field>
                <Field label="Membership Tier">
                  <select
                    className="w-full rounded-xl border border-white/10 bg-[#0a1020] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/60"
                    value={course.membershipTier}
                    onChange={(event) =>
                      updateField(
                        "membershipTier",
                        event.target.value as AdminCourse["membershipTier"],
                      )
                    }
                  >
                    <option value="free">Free</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="elite">Elite</option>
                  </select>
                </Field>
                <Field label="Duration">
                  <input
                    className="w-full rounded-xl border border-white/10 bg-[#0a1020] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/60"
                    value={course.duration}
                    onChange={(event) => updateField("duration", event.target.value)}
                    placeholder="4 hours"
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
              <h2 className="mb-4 text-lg font-bold">Learning Objectives</h2>
              <textarea
                className="h-28 w-full resize-none rounded-xl border border-white/10 bg-[#0a1020] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/60"
                value={course.learningObjectives.join("\n")}
                onChange={(event) =>
                  updateField(
                    "learningObjectives",
                    event.target.value
                      .split("\n")
                      .map((value) => value.trim())
                      .filter(Boolean),
                  )
                }
                placeholder="One objective per line"
              />
            </div>
          </div>
        )}

        {tab === "modules" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Modules ({course.modules.length})</h2>
              <button
                onClick={() => setAddingModule(true)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
              >
                + Add Module
              </button>
            </div>

            {addingModule && (
              <div className="flex gap-3 rounded-2xl border border-blue-500/30 bg-[#101a2f] p-4">
                <input
                  autoFocus
                  className="flex-1 rounded-xl border border-white/10 bg-[#0a1020] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/60"
                  value={newModuleTitle}
                  onChange={(event) => setNewModuleTitle(event.target.value)}
                  placeholder="Module title"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") addModule();
                    if (event.key === "Escape") {
                      setAddingModule(false);
                      setNewModuleTitle("");
                    }
                  }}
                />
                <button
                  onClick={addModule}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setAddingModule(false);
                    setNewModuleTitle("");
                  }}
                  className="rounded-xl border border-white/20 px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            )}

            {course.modules.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-12 text-center">
                <p className="text-slate-400">
                  No modules yet. Add a module to start building your course.
                </p>
              </div>
            ) : (
              course.modules.map((moduleItem) => (
                <div
                  key={moduleItem.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#101a2f]"
                >
                  <button
                    onClick={() =>
                      setExpandedModule(expandedModule === moduleItem.id ? null : moduleItem.id)
                    }
                    className="flex w-full items-center justify-between px-6 py-4 hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <span className="text-xs font-mono text-slate-500">
                        MOD {moduleItem.order + 1}
                      </span>
                      <span className="font-semibold text-white">{moduleItem.title}</span>
                      <span className="text-xs text-slate-500">
                        {moduleItem.lessons.length} lesson
                        {moduleItem.lessons.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <span className="text-slate-400">
                      {expandedModule === moduleItem.id ? "▲" : "▼"}
                    </span>
                  </button>

                  {expandedModule === moduleItem.id && (
                    <div className="border-t border-white/10 px-6 pb-4 pt-4">
                      <div className="space-y-2">
                        {moduleItem.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between rounded-xl border border-white/5 bg-[#0a1020] px-4 py-3"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-slate-600">
                                L{lesson.order + 1}
                              </span>
                              <span className="text-sm text-white">{lesson.title}</span>
                              {lesson.duration && (
                                <span className="text-xs text-slate-500">{lesson.duration}</span>
                              )}
                            </div>
                            <span
                              className={`text-xs ${
                                lesson.status === "published"
                                  ? "text-green-400"
                                  : "text-yellow-400"
                              }`}
                            >
                              {lesson.status}
                            </span>
                          </div>
                        ))}
                      </div>

                      {addingLesson === moduleItem.id ? (
                        <div className="mt-3 flex gap-2">
                          <input
                            autoFocus
                            className="flex-1 rounded-xl border border-white/10 bg-[#0a1020] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/60"
                            value={newLessonTitle}
                            onChange={(event) => setNewLessonTitle(event.target.value)}
                            placeholder="Lesson title"
                            onKeyDown={(event) => {
                              if (event.key === "Enter") addLesson(moduleItem.id);
                              if (event.key === "Escape") {
                                setAddingLesson(null);
                                setNewLessonTitle("");
                              }
                            }}
                          />
                          <button
                            onClick={() => addLesson(moduleItem.id)}
                            className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold hover:bg-blue-500"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setAddingLesson(null);
                              setNewLessonTitle("");
                            }}
                            className="rounded-xl border border-white/20 px-3 py-2 text-sm text-slate-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAddingLesson(moduleItem.id);
                            setNewLessonTitle("");
                          }}
                          className="mt-3 text-sm text-blue-400 hover:text-blue-300"
                        >
                          + Add Lesson
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {tab === "seo" && (
          <div className="space-y-4 rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <h2 className="text-lg font-bold">SEO Metadata</h2>
            <Field label="Meta Title">
              <input
                className="w-full rounded-xl border border-white/10 bg-[#0a1020] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/60"
                value={course.seo.metaTitle}
                onChange={(event) =>
                  updateField("seo", { ...course.seo, metaTitle: event.target.value })
                }
              />
            </Field>
            <Field label="Meta Description">
              <textarea
                className="h-20 w-full resize-none rounded-xl border border-white/10 bg-[#0a1020] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/60"
                value={course.seo.metaDescription}
                onChange={(event) =>
                  updateField("seo", {
                    ...course.seo,
                    metaDescription: event.target.value,
                  })
                }
              />
            </Field>
            <Field label="Canonical URL">
              <input
                className="w-full rounded-xl border border-white/10 bg-[#0a1020] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/60"
                value={course.seo.canonicalUrl}
                onChange={(event) =>
                  updateField("seo", { ...course.seo, canonicalUrl: event.target.value })
                }
              />
            </Field>
            <Field label="Keywords (comma-separated)">
              <input
                className="w-full rounded-xl border border-white/10 bg-[#0a1020] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/60"
                value={course.seo.keywords.join(", ")}
                onChange={(event) =>
                  updateField("seo", {
                    ...course.seo,
                    keywords: event.target.value
                      .split(",")
                      .map((keyword) => keyword.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field>
          </div>
        )}

        {tab === "publish" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
              <h2 className="text-lg font-bold">Publish Status</h2>
              <p className="mt-2 text-slate-400">
                Current status:{" "}
                <span className={`font-semibold ${STATUS_COLORS[course.status] ?? "text-white"}`}>
                  {course.status}
                </span>
              </p>
              {course.publishedAt && (
                <p className="mt-1 text-xs text-slate-500">
                  Published: {new Date(course.publishedAt).toLocaleString()}
                </p>
              )}
              {course.archivedAt && (
                <p className="mt-1 text-xs text-slate-500">
                  Archived: {new Date(course.archivedAt).toLocaleString()}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                {course.status !== "published" && (
                  <button
                    onClick={() => changeStatus("published")}
                    disabled={saving}
                    className="rounded-xl bg-green-600 px-5 py-2.5 font-semibold hover:bg-green-500 disabled:opacity-60"
                  >
                    Publish Course
                  </button>
                )}
                {course.status === "published" && (
                  <button
                    onClick={() => changeStatus("draft")}
                    disabled={saving}
                    className="rounded-xl border border-yellow-500/40 px-5 py-2.5 font-semibold text-yellow-300 hover:border-yellow-400 disabled:opacity-60"
                  >
                    Unpublish (Draft)
                  </button>
                )}
                {course.status !== "archived" && (
                  <button
                    onClick={() => changeStatus("archived")}
                    disabled={saving}
                    className="rounded-xl border border-slate-500/40 px-5 py-2.5 font-semibold text-slate-400 hover:border-slate-400 disabled:opacity-60"
                  >
                    Archive
                  </button>
                )}
                {course.status === "archived" && (
                  <button
                    onClick={() => changeStatus("draft")}
                    disabled={saving}
                    className="rounded-xl border border-white/20 px-5 py-2.5 font-semibold text-slate-300 hover:border-white/40 disabled:opacity-60"
                  >
                    Restore to Draft
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
              <h2 className="text-lg font-bold">Course Preview</h2>
              <p className="mt-2 text-slate-400">
                Review the course structure before publishing.
              </p>
              <div className="mt-4 space-y-1 rounded-xl border border-white/10 bg-[#0a1020] p-4 text-sm">
                <p>
                  <span className="text-slate-500">Title:</span>{" "}
                  <span className="text-white">{course.title}</span>
                </p>
                <p>
                  <span className="text-slate-500">Path:</span>{" "}
                  <span className="font-semibold">{course.path.toUpperCase()}</span>
                </p>
                <p>
                  <span className="text-slate-500">Language:</span>{" "}
                  <span className="text-white">{course.language}</span>
                </p>
                <p>
                  <span className="text-slate-500">Modules:</span>{" "}
                  <span className="text-white">{course.modules.length}</span>
                </p>
                <p>
                  <span className="text-slate-500">Lessons:</span>{" "}
                  <span className="text-white">
                    {course.modules.reduce(
                      (sum, moduleItem) => sum + moduleItem.lessons.length,
                      0,
                    )}
                  </span>
                </p>
                <p>
                  <span className="text-slate-500">Membership:</span>{" "}
                  <span className="text-white">{course.membershipTier}</span>
                </p>
                <p>
                  <span className="text-slate-500">Objectives:</span>{" "}
                  <span className="text-white">{course.learningObjectives.length}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-300">{label}</label>
      {children}
    </div>
  );
}
