"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PathColor = "red" | "white" | "blue";
type Difficulty = "beginner" | "intermediate" | "advanced";
type MembershipTier = "free" | "basic" | "premium" | "elite";
type Language = "en" | "es" | "fr" | "fr-CA";

export default function CourseFormClient({ mode }: { mode: "create" }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    path: "white" as PathColor,
    language: "en" as Language,
    difficulty: "beginner" as Difficulty,
    duration: "",
    membershipTier: "free" as MembershipTier,
    instructorName: "",
    tags: "",
    categories: "",
    learningObjectives: "",
    prerequisites: "",
  });

  useEffect(() => {
    fetch("/api/admin/auth/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setCsrfToken(data.csrfToken ?? ""))
      .catch(() => {});
  }, []);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Course title is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          categories: form.categories
            .split(",")
            .map((category) => category.trim())
            .filter(Boolean),
          learningObjectives: form.learningObjectives
            .split("\n")
            .map((objective) => objective.trim())
            .filter(Boolean),
          prerequisites: form.prerequisites
            .split("\n")
            .map((prerequisite) => prerequisite.trim())
            .filter(Boolean),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to create course");
        return;
      }

      router.push(`/admin/courses/${data.course.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-300">
          Admin → Courses
        </p>
        <h1 className="mt-2 text-4xl font-black">
          {mode === "create" ? "New Course" : "Course"}
        </h1>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
              {error}
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <h2 className="mb-4 text-lg font-bold">Basic Information</h2>
            <div className="space-y-4">
              <FieldGroup label="Course Title *">
                <input
                  className="field"
                  value={form.title}
                  onChange={(event) => update("title", event.target.value)}
                  placeholder="e.g. Real Estate Fundamentals"
                  required
                />
              </FieldGroup>
              <FieldGroup label="Subtitle">
                <input
                  className="field"
                  value={form.subtitle}
                  onChange={(event) => update("subtitle", event.target.value)}
                  placeholder="A brief one-line description"
                />
              </FieldGroup>
              <FieldGroup label="Description">
                <textarea
                  className="field h-28 resize-none"
                  value={form.description}
                  onChange={(event) => update("description", event.target.value)}
                  placeholder="Course overview..."
                />
              </FieldGroup>
              <FieldGroup label="Instructor Name">
                <input
                  className="field"
                  value={form.instructorName}
                  onChange={(event) => update("instructorName", event.target.value)}
                  placeholder="John Smith"
                />
              </FieldGroup>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <h2 className="mb-4 text-lg font-bold">Classification</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldGroup label="Learning Path">
                <select
                  className="field"
                  value={form.path}
                  onChange={(event) => update("path", event.target.value)}
                >
                  <option value="red">🔴 RED Path — Real Estate</option>
                  <option value="white">⚪ WHITE Path — Paper Assets</option>
                  <option value="blue">🔵 BLUE Path — Business</option>
                </select>
              </FieldGroup>
              <FieldGroup label="Language">
                <select
                  className="field"
                  value={form.language}
                  onChange={(event) => update("language", event.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="fr-CA">Français (Canada)</option>
                </select>
              </FieldGroup>
              <FieldGroup label="Difficulty">
                <select
                  className="field"
                  value={form.difficulty}
                  onChange={(event) => update("difficulty", event.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </FieldGroup>
              <FieldGroup label="Membership Tier">
                <select
                  className="field"
                  value={form.membershipTier}
                  onChange={(event) => update("membershipTier", event.target.value)}
                >
                  <option value="free">Free</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="elite">Elite</option>
                </select>
              </FieldGroup>
              <FieldGroup label="Estimated Duration">
                <input
                  className="field"
                  value={form.duration}
                  onChange={(event) => update("duration", event.target.value)}
                  placeholder="e.g. 4 hours"
                />
              </FieldGroup>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <h2 className="mb-4 text-lg font-bold">Content Details</h2>
            <div className="space-y-4">
              <FieldGroup label="Learning Objectives (one per line)">
                <textarea
                  className="field h-24 resize-none"
                  value={form.learningObjectives}
                  onChange={(event) => update("learningObjectives", event.target.value)}
                  placeholder={"Understand tax lien investing\nIdentify undervalued properties"}
                />
              </FieldGroup>
              <FieldGroup label="Prerequisites (one per line)">
                <textarea
                  className="field h-20 resize-none"
                  value={form.prerequisites}
                  onChange={(event) => update("prerequisites", event.target.value)}
                  placeholder={"Basic financial literacy\nUnderstanding of credit"}
                />
              </FieldGroup>
              <FieldGroup label="Tags (comma-separated)">
                <input
                  className="field"
                  value={form.tags}
                  onChange={(event) => update("tags", event.target.value)}
                  placeholder="real-estate, investing, beginner"
                />
              </FieldGroup>
              <FieldGroup label="Categories (comma-separated)">
                <input
                  className="field"
                  value={form.categories}
                  onChange={(event) => update("categories", event.target.value)}
                  placeholder="Real Estate, Financial Foundations"
                />
              </FieldGroup>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push("/admin/courses")}
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-slate-300 hover:border-white/40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:opacity-60"
            >
              {saving ? "Creating…" : "Create Course"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .field {
          width: 100%;
          background: #0a1020;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          color: white;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          outline: none;
        }
        .field:focus {
          border-color: rgba(59, 130, 246, 0.6);
        }
        .field option {
          background: #0a1020;
        }
      `}</style>
    </main>
  );
}

function FieldGroup({
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
