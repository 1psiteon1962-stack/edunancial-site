"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  lessonId: string;
  initialContent: string;
  filePath: string;
  previewUrl: string | null;
  editorEmail: string;
}

type TemplateKey = "scenario" | "feedback" | "remediation" | "media" | "nextStep";

const AUTHORING_TEMPLATES: Record<TemplateKey, { label: string; description: string; markdown: string }> = {
  scenario: {
    label: "Scenario",
    description: "Add an applied learner decision point.",
    markdown: `\n\n## Applied Scenario\n\n**Situation:** Describe a realistic learner situation here.\n\n**Decision:** What should the learner do next, and why?\n\n### Choices\n\nA. Choice A\nB. Choice B\nC. Choice C\nD. Choice D\n`,
  },
  feedback: {
    label: "A/B/C/D Feedback",
    description: "Add tailored feedback for each answer choice.",
    markdown: `\n\n## Choice Feedback\n\n### A — [Choice A]\n**Feedback:** Explain what the learner understood or missed.\n**Why:** Explain the underlying principle.\n\n### B — [Choice B]\n**Feedback:** Explain what the learner understood or missed.\n**Why:** Explain the underlying principle.\n\n### C — [Choice C]\n**Feedback:** Explain what the learner understood or missed.\n**Why:** Explain the underlying principle.\n\n### D — [Choice D]\n**Feedback:** Explain what the learner understood or missed.\n**Why:** Explain the underlying principle.\n`,
  },
  remediation: {
    label: "Remediation",
    description: "Add corrective instruction and a retry path.",
    markdown: `\n\n## Remediation\n\nIf the learner struggles with this concept:\n\n1. Re-explain the core idea in simpler language.\n2. Give one additional worked example.\n3. Identify the most common misconception.\n4. Ask a shorter retry question before continuing.\n`,
  },
  media: {
    label: "Media Block",
    description: "Reserve structured space for image, audio, or video support.",
    markdown: `\n\n## Optional Media\n\n- **Image:** [Describe or link the supporting image]\n- **Audio:** [Narration or explanation reference]\n- **Video:** [Lesson or feedback video reference]\n- **Caption / Transcript:** [Accessibility text]\n`,
  },
  nextStep: {
    label: "Next-Step Logic",
    description: "Document advancement, retry, or follow-up logic.",
    markdown: `\n\n## Next-Step Logic\n\n- **If learner demonstrates mastery:** Continue to the next lesson or applied task.\n- **If learner is partially correct:** Show targeted feedback and one retry.\n- **If learner is incorrect:** Route to remediation before retrying.\n- **Optional extension:** Provide an advanced application task for higher-level learners.\n`,
  },
};

export default function LessonEditorClient({
  lessonId,
  initialContent,
  filePath,
  previewUrl,
  editorEmail,
}: Props) {
  const [content, setContent] = useState(initialContent);
  const [savedContent, setSavedContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isDirty = content !== savedContent;
  const wordCount = useMemo(() => content.trim().split(/\s+/).filter(Boolean).length, [content]);

  useEffect(() => {
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [isDirty]);

  function getCsrfToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("edunancial_admin_csrf="))
      ?.split("=")[1] ?? "";
  }

  function insertTemplate(templateKey: TemplateKey) {
    const template = AUTHORING_TEMPLATES[templateKey].markdown;
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((current) => `${current}${template}`);
      return;
    }

    const start = textarea.selectionStart ?? content.length;
    const end = textarea.selectionEnd ?? start;
    const nextContent = `${content.slice(0, start)}${template}${content.slice(end)}`;
    setContent(nextContent);
    setStatus(null);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + template.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/curriculum/save-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": getCsrfToken(),
        },
        body: JSON.stringify({ lessonId, content }),
      });

      const data = await res.json();
      if (res.ok) {
        setSavedContent(content);
        setStatus({ type: "success", message: "Lesson saved successfully." });
      } else {
        setStatus({ type: "error", message: data.error ?? "Save failed." });
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Could not save." });
    } finally {
      setSaving(false);
    }
  }

  function handleRevert() {
    if (!isDirty) return;
    if (!confirm("Discard all unsaved changes and restore the last saved version?")) return;
    setContent(savedContent);
    setStatus(null);
  }

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete lesson ${lessonId}? This cannot be undone.`)) return;
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/curriculum/delete-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": getCsrfToken(),
        },
        body: JSON.stringify({ lessonId }),
      });

      const data = await res.json();
      if (res.ok) {
        window.location.href = "/admin/curriculum";
      } else {
        setStatus({ type: "error", message: data.error ?? "Delete failed." });
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Could not delete." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="border-b border-white/10 bg-[#0c1422] px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link href="/admin/curriculum" className="text-sm text-slate-400 hover:text-white">
            ← Curriculum
          </Link>
          <span className="text-slate-600">/</span>
          <span className="font-mono text-sm text-white">{lessonId}</span>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
              isDirty ? "bg-amber-500/15 text-amber-300" : "bg-emerald-500/15 text-emerald-300"
            }`}
          >
            {isDirty ? "Unsaved changes" : "Saved"}
          </span>
        </div>
        <div className="text-xs text-slate-500">
          Editing as <strong className="text-slate-400">{editorEmail}</strong>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500 font-mono">{filePath}</p>
          <p className="text-xs text-slate-500">{wordCount.toLocaleString()} words · {content.length.toLocaleString()} characters</p>
        </div>

        {status && (
          <div
            className={`mb-6 rounded-xl px-5 py-4 text-sm font-semibold ${
              status.type === "success"
                ? "bg-green-900/40 border border-green-700/40 text-green-300"
                : "bg-red-900/40 border border-red-700/40 text-red-300"
            }`}
          >
            {status.message}
          </div>
        )}

        <section className="mb-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Owner Authoring Workbench</p>
              <h2 className="mt-1 text-xl font-black">Structured lesson enhancements</h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-400">
                Insert standardized authoring blocks at the cursor without replacing existing curriculum. Edit the inserted text normally after it appears in the lesson.
              </p>
            </div>
            {previewUrl && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-black text-slate-950 hover:bg-white"
              >
                Preview as Learner ↗
              </a>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {(Object.entries(AUTHORING_TEMPLATES) as Array<[TemplateKey, (typeof AUTHORING_TEMPLATES)[TemplateKey]]>).map(
              ([key, template]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => insertTemplate(key)}
                  className="rounded-xl border border-white/10 bg-[#101a2f] p-4 text-left hover:border-blue-400"
                >
                  <span className="block text-sm font-bold text-white">+ {template.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-400">{template.description}</span>
                </button>
              ),
            )}
          </div>
        </section>

        <div className="rounded-2xl border border-white/10 bg-[#0c1422] overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-white/10 flex-wrap">
            <div>
              <span className="text-sm font-semibold text-slate-300">Lesson Markdown</span>
              <p className="mt-0.5 text-xs text-slate-500">Existing content remains fully editable; authoring helpers only insert text.</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleRevert}
                disabled={saving || !isDirty}
                className="rounded-lg border border-slate-600 px-4 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Revert Unsaved
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !isDirty}
                className="rounded-lg bg-blue-700 px-5 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving…" : isDirty ? "Save Changes" : "Saved"}
              </button>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setStatus(null);
            }}
            className="w-full bg-transparent px-6 py-5 font-mono text-sm text-slate-200 leading-relaxed resize-y focus:outline-none"
            rows={40}
            spellCheck={false}
          />
        </div>

        <div className="mt-12 rounded-2xl border border-red-900/40 bg-red-950/20 p-6">
          <h2 className="text-lg font-black text-red-400 mb-2">Danger Zone</h2>
          <p className="text-sm text-slate-400 mb-4">
            Permanently deletes the lesson file from the filesystem. This action cannot be undone.
          </p>
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="rounded-xl bg-red-700 px-6 py-3 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50"
          >
            Delete Lesson
          </button>
        </div>
      </div>
    </main>
  );
}
