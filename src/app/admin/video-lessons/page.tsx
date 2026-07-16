"use client";

// ─────────────────────────────────────────────────────────────
// Content Upload Portal — Admin Video Lesson Manager
//
// Full CMS scaffolding for all Content Upload Portal fields.
// Backend persistence (Supabase, API routes) can be wired in
// without structural redesign of this form architecture.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import type { ReactNode, ChangeEvent } from "react";
import { extractYouTubeVideoId, buildYouTubeEmbedUrl } from "@/lib/video-learning/youtube";
import type { PublicationStatus } from "@/lib/video-learning/types";

type DownloadEntry = { label: string; url: string; type: string };
type QuizQuestion = { question: string; options: string[]; correctIndex: number; explanation: string };
type VersionEntry = { version: string; date: string; notes: string };

interface LessonFormState {
  courseTitle: string;
  lessonNumber: string;
  lessonTitle: string;
  lessonDescription: string;
  youtubeUrl: string;
  videoLength: string;
  language: string;
  instructor: string;
  transcript: string;
  closedCaptionAvailability: boolean;
  workbookUrl: string;
  downloads: DownloadEntry[];
  quizQuestions: QuizQuestion[];
  aiPromptSet: string[];
  relatedLessons: string;
  prerequisites: string;
  completionStatus: string;
  publicationStatus: PublicationStatus;
  version: string;
  versionNotes: string;
  versionHistory: VersionEntry[];
  objectives: string;
  reflectionQuestions: string;
}

const defaultForm: LessonFormState = {
  courseTitle: "",
  lessonNumber: "",
  lessonTitle: "",
  lessonDescription: "",
  youtubeUrl: "",
  videoLength: "",
  language: "en",
  instructor: "",
  transcript: "",
  closedCaptionAvailability: false,
  workbookUrl: "",
  downloads: [],
  quizQuestions: [],
  aiPromptSet: ["", "", "", "", ""],
  relatedLessons: "",
  prerequisites: "",
  completionStatus: "not_started",
  publicationStatus: "draft",
  version: "1.0.0",
  versionNotes: "",
  versionHistory: [],
  objectives: "",
  reflectionQuestions: "",
};

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "pt", label: "Portuguese" },
  { code: "ar", label: "Arabic" },
  { code: "zh-Hans", label: "Chinese (Simplified)" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  { code: "hi", label: "Hindi" },
  { code: "sw", label: "Swahili" },
];

const DOWNLOAD_TYPES = ["workbook", "checklist", "template", "guide", "spreadsheet", "case_study", "reference", "external_link"];

function SectionHeader({ icon, title, description }: { icon: string; title: string; description?: string }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <span className="text-2xl mt-0.5">{icon}</span>
      <div>
        <h2 className="text-xl font-black text-white">{title}</h2>
        {description && <p className="text-sm text-slate-400 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

function FormField({ label, children, required }: { label: string; children: ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-bold text-slate-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-yellow-500 transition";
const textareaCls = `${inputCls} resize-none`;

export default function VideoLessonsAdmin() {
  const [form, setForm] = useState<LessonFormState>(defaultForm);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("core");

  const set = (key: keyof LessonFormState, value: unknown) =>
    setForm((prev: LessonFormState) => ({ ...prev, [key]: value }));

  const embedPreview = form.youtubeUrl
    ? buildYouTubeEmbedUrl(form.youtubeUrl, { rel: 0, modestbranding: 1 })
    : null;

  const videoId = form.youtubeUrl ? extractYouTubeVideoId(form.youtubeUrl) : null;

  const handleSave = () => {
    const entry: VersionEntry = {
      version: form.version,
      date: new Date().toISOString().slice(0, 10),
      notes: form.versionNotes || "Lesson saved.",
    };
    set("versionHistory", [entry, ...form.versionHistory]);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addDownload = () =>
    set("downloads", [...form.downloads, { label: "", url: "", type: "guide" }]);

  const updateDownload = (i: number, field: keyof DownloadEntry, value: string) => {
    const updated = [...form.downloads];
    updated[i] = { ...updated[i], [field]: value };
    set("downloads", updated);
  };

  const removeDownload = (i: number) =>
    set("downloads", form.downloads.filter((_, idx) => idx !== i));

  const addQuizQuestion = () =>
    set("quizQuestions", [...form.quizQuestions, {
      question: "", options: ["", "", "", ""], correctIndex: 0, explanation: "",
    }]);

  const updateQuizQuestion = (i: number, field: string, value: unknown) => {
    const updated = [...form.quizQuestions];
    updated[i] = { ...updated[i], [field]: value };
    set("quizQuestions", updated);
  };

  const updateQuizOption = (qi: number, oi: number, value: string) => {
    const updated = [...form.quizQuestions];
    const opts = [...updated[qi].options];
    opts[oi] = value;
    updated[qi] = { ...updated[qi], options: opts };
    set("quizQuestions", updated);
  };

  const updateAIPrompt = (i: number, value: string) => {
    const updated = [...form.aiPromptSet];
    updated[i] = value;
    set("aiPromptSet", updated);
  };

  const SECTIONS = [
    { id: "core", label: "📋 Core Info" },
    { id: "video", label: "🎬 Video" },
    { id: "content", label: "📚 Content" },
    { id: "resources", label: "📂 Downloads" },
    { id: "quiz", label: "🧠 Quiz" },
    { id: "ai", label: "🤖 AI Coach" },
    { id: "meta", label: "⚙️ Settings" },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-yellow-400 font-bold mb-2">
            Edunancial Admin
          </p>
          <h1 className="text-4xl font-black">Content Upload Portal</h1>
          <p className="text-slate-400 mt-2 text-sm">
            Create and manage video lessons. All fields correspond to the global lesson architecture.
            The same structure is used across all regional Edunancial websites.
          </p>
        </div>

        {/* Section nav */}
        <div className="flex gap-2 flex-wrap mb-8 border-b border-slate-800 pb-4">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                activeSection === s.id
                  ? "bg-yellow-500 text-black"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {/* ── CORE INFO ─────────────────────────────────── */}
          {activeSection === "core" && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 space-y-6">
              <SectionHeader icon="📋" title="Core Lesson Information" description="The primary identification and content fields for this lesson." />
              <div className="grid gap-5 md:grid-cols-2">
                <FormField label="Course Title" required>
                  <input className={inputCls} placeholder="e.g. RED: Real Estate Competency" value={form.courseTitle} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set("courseTitle", e.target.value)} />
                </FormField>
                <FormField label="Lesson Number" required>
                  <input className={inputCls} type="number" placeholder="1" value={form.lessonNumber} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set("lessonNumber", e.target.value)} />
                </FormField>
              </div>
              <FormField label="Lesson Title" required>
                <input className={inputCls} placeholder="e.g. Introduction to Real Estate Investing" value={form.lessonTitle} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set("lessonTitle", e.target.value)} />
              </FormField>
              <FormField label="Lesson Description">
                <textarea className={textareaCls} rows={3} placeholder="Brief summary shown to learners below the video." value={form.lessonDescription} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set("lessonDescription", e.target.value)} />
              </FormField>
              <div className="grid gap-5 md:grid-cols-2">
                <FormField label="Instructor">
                  <input className={inputCls} placeholder="e.g. Marcus Thompson" value={form.instructor} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set("instructor", e.target.value)} />
                </FormField>
                <FormField label="Language">
                  <select className={inputCls} value={form.language} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set("language", e.target.value)}>
                    {LANGUAGES.map(l => (
                      <option key={l.code} value={l.code}>{l.label} ({l.code})</option>
                    ))}
                  </select>
                </FormField>
              </div>
              <FormField label="Learning Objectives (one per line)">
                <textarea className={textareaCls} rows={4} placeholder={"After this lesson, learners will be able to:\n- Identify the four primary real estate strategies\n- Calculate NOI for a rental property"} value={form.objectives} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set("objectives", e.target.value)} />
              </FormField>
              <FormField label="Prerequisites (lesson IDs, comma-separated)">
                <input className={inputCls} placeholder="e.g. red-01, ff-01" value={form.prerequisites} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set("prerequisites", e.target.value)} />
              </FormField>
              <FormField label="Related Lessons (lesson IDs, comma-separated)">
                <input className={inputCls} placeholder="e.g. red-02, red-03" value={form.relatedLessons} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set("relatedLessons", e.target.value)} />
              </FormField>
            </div>
          )}

          {/* ── VIDEO ────────────────────────────────────── */}
          {activeSection === "video" && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 space-y-6">
              <SectionHeader
                icon="🎬"
                title="Video Configuration"
                description="Paste the YouTube URL. The site automatically embeds the latest version — no re-upload needed when the video is updated on YouTube."
              />
              <FormField label="YouTube URL" required>
                <input
                  className={inputCls}
                  placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                  value={form.youtubeUrl}
                  onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set("youtubeUrl", e.target.value)}
                />
                {videoId && (
                  <p className="text-xs text-green-400 mt-1">✓ Video ID detected: <code className="bg-slate-800 px-1 rounded">{videoId}</code></p>
                )}
                {form.youtubeUrl && !videoId && (
                  <p className="text-xs text-red-400 mt-1">⚠ Could not detect a valid YouTube video ID. Check the URL.</p>
                )}
              </FormField>
              <FormField label="Video Length">
                <input className={inputCls} placeholder="e.g. 8 min" value={form.videoLength} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set("videoLength", e.target.value)} />
              </FormField>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="cc"
                  checked={form.closedCaptionAvailability}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => set("closedCaptionAvailability", e.target.checked)}
                  className="w-4 h-4 accent-yellow-400"
                />
                <label htmlFor="cc" className="text-sm text-slate-300 font-medium">
                  Closed captions are available for this video
                </label>
              </div>

              {/* Live embed preview */}
              {embedPreview && (
                <div>
                  <p className="text-sm font-bold text-slate-400 mb-3">📺 Embed Preview</p>
                  <div
                    className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-700"
                    style={{ paddingBottom: "56.25%" }}
                  >
                    <iframe
                      src={embedPreview}
                      title="Preview"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── CONTENT ──────────────────────────────────── */}
          {activeSection === "content" && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 space-y-6">
              <SectionHeader icon="📚" title="Lesson Content" />
              <FormField label="Full Transcript">
                <textarea className={textareaCls} rows={10} placeholder="Paste the full video transcript here. Used for accessibility, closed captions, and search indexing." value={form.transcript} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set("transcript", e.target.value)} />
              </FormField>
              <FormField label="Reflection Questions (one per line)">
                <textarea className={textareaCls} rows={5} placeholder={"What was the most important concept from this lesson?\nHow would you apply this to your current financial situation?"} value={form.reflectionQuestions} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set("reflectionQuestions", e.target.value)} />
              </FormField>
            </div>
          )}

          {/* ── DOWNLOADS ────────────────────────────────── */}
          {activeSection === "resources" && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 space-y-6">
              <SectionHeader
                icon="📂"
                title="Downloads &amp; Resources"
                description="Add workbooks, checklists, templates, spreadsheets, guides, and external links for this lesson."
              />
              <FormField label="Workbook URL">
                <input className={inputCls} placeholder="/downloads/lesson-workbook.pdf" value={form.workbookUrl} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set("workbookUrl", e.target.value)} />
              </FormField>

              {form.downloads.length > 0 && (
                <div className="space-y-4">
                  {form.downloads.map((d, i) => (
                    <div key={i} className="rounded-xl bg-slate-800 border border-slate-700 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-300">Download #{i + 1}</p>
                        <button onClick={() => removeDownload(i)} className="text-xs text-red-400 hover:text-red-300">
                          Remove
                        </button>
                      </div>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Type</label>
                          <select className={inputCls} value={d.type} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => updateDownload(i, "type", e.target.value)}>
                            {DOWNLOAD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Label</label>
                          <input className={inputCls} placeholder="Cash Flow Checklist" value={d.label} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => updateDownload(i, "label", e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">URL or Path</label>
                          <input className={inputCls} placeholder="/downloads/file.pdf" value={d.url} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => updateDownload(i, "url", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={addDownload}
                className="rounded-xl bg-slate-800 border border-slate-700 hover:border-yellow-500 transition px-5 py-3 text-sm font-bold text-slate-300"
              >
                + Add Download
              </button>
            </div>
          )}

          {/* ── QUIZ ─────────────────────────────────────── */}
          {activeSection === "quiz" && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 space-y-6">
              <SectionHeader
                icon="🧠"
                title="Lesson Quiz"
                description="Build a multiple-choice quiz to test learner understanding before advancing."
              />

              {form.quizQuestions.length > 0 && (
                <div className="space-y-6">
                  {form.quizQuestions.map((q, qi) => (
                    <div key={qi} className="rounded-xl bg-slate-800 border border-slate-700 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-black text-white">Question {qi + 1}</p>
                        <button
                          onClick={() => set("quizQuestions", form.quizQuestions.filter((_, i) => i !== qi))}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                      <textarea
                        className={textareaCls}
                        rows={2}
                        placeholder="Question text…"
                        value={q.question}
                        onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => updateQuizQuestion(qi, "question", e.target.value)}
                      />
                      <div className="grid gap-2">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correct-${qi}`}
                              checked={q.correctIndex === oi}
                              onChange={() => updateQuizQuestion(qi, "correctIndex", oi)}
                              className="accent-green-400 w-4 h-4 flex-shrink-0"
                            />
                            <input
                              className={inputCls}
                              placeholder={`Option ${oi + 1}`}
                              value={opt}
                              onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => updateQuizOption(qi, oi, e.target.value)}
                            />
                          </div>
                        ))}
                        <p className="text-xs text-slate-500 pl-7">Select the radio button next to the correct answer.</p>
                      </div>
                      <textarea
                        className={textareaCls}
                        rows={2}
                        placeholder="Explanation shown after answering…"
                        value={q.explanation}
                        onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => updateQuizQuestion(qi, "explanation", e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={addQuizQuestion}
                className="rounded-xl bg-slate-800 border border-slate-700 hover:border-purple-500 transition px-5 py-3 text-sm font-bold text-slate-300"
              >
                + Add Quiz Question
              </button>
            </div>
          )}

          {/* ── AI COACH ─────────────────────────────────── */}
          {activeSection === "ai" && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 space-y-6">
              <SectionHeader
                icon="🤖"
                title="AI Coach Configuration"
                description="Enter 3–5 Socratic questions the AI Coach will ask after the learner watches the video. The AI reinforces the lesson — it does not make financial, legal, tax, or investment decisions."
              />
              <div className="rounded-xl bg-blue-950 border border-blue-800 px-4 py-3 text-xs text-blue-300 leading-relaxed">
                <span className="font-bold text-yellow-400">⚠ Guardrail Reminder: </span>
                All AI prompts must be educational reinforcement only. Questions must guide thinking, not provide advice. Never include prompts that could be interpreted as financial, legal, tax, or investment recommendations.
              </div>
              <div className="space-y-3">
                {form.aiPromptSet.map((prompt, i) => (
                  <FormField key={i} label={`Socratic Question ${i + 1}`}>
                    <input
                      className={inputCls}
                      placeholder={`e.g. How does understanding ${i === 0 ? "cash flow" : "this concept"} change how you evaluate opportunities?`}
                      value={prompt}
                      onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => updateAIPrompt(i, e.target.value)}
                    />
                  </FormField>
                ))}
              </div>
              {form.aiPromptSet.length < 8 && (
                <button
                  onClick={() => set("aiPromptSet", [...form.aiPromptSet, ""])}
                  className="text-sm text-slate-500 hover:text-slate-300 transition"
                >
                  + Add another question
                </button>
              )}
            </div>
          )}

          {/* ── SETTINGS ─────────────────────────────────── */}
          {activeSection === "meta" && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 space-y-6">
              <SectionHeader icon="⚙️" title="Publication &amp; Version Settings" />
              <div className="grid gap-5 md:grid-cols-3">
                <FormField label="Publication Status">
                  <select className={inputCls} value={form.publicationStatus} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set("publicationStatus", e.target.value as PublicationStatus)}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </FormField>
                <FormField label="Completion Status">
                  <select className={inputCls} value={form.completionStatus} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set("completionStatus", e.target.value)}>
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </FormField>
                <FormField label="Version">
                  <input className={inputCls} placeholder="1.0.0" value={form.version} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set("version", e.target.value)} />
                </FormField>
              </div>
              <FormField label="Version Notes (for this save)">
                <textarea className={textareaCls} rows={3} placeholder="What changed in this version?" value={form.versionNotes} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set("versionNotes", e.target.value)} />
              </FormField>

              {/* Version history */}
              {form.versionHistory.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-400 mb-3">Version History</h3>
                  <div className="rounded-xl bg-slate-800 border border-slate-700 overflow-hidden divide-y divide-slate-700">
                    {form.versionHistory.map((v, i) => (
                      <div key={i} className="px-4 py-3 flex items-start gap-4">
                        <code className="text-xs text-yellow-400 font-bold flex-shrink-0">{v.version}</code>
                        <span className="text-xs text-slate-500 flex-shrink-0">{v.date}</span>
                        <span className="text-xs text-slate-300">{v.notes}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-slate-800 pt-8">
          <p className="text-xs text-slate-500">
            All fields are part of the global Edunancial lesson architecture and are reused across all regional websites.
          </p>
          <button
            onClick={handleSave}
            className={`rounded-xl px-8 py-4 font-black text-sm transition ${
              saved
                ? "bg-green-600 text-white"
                : "bg-yellow-500 hover:bg-yellow-400 text-black"
            }`}
          >
            {saved ? "✅ Saved!" : "Save Lesson"}
          </button>
        </div>
      </div>
    </main>
  );
}
