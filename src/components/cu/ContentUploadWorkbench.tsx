"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { LANGUAGE_CATALOG } from "@/lib/international/languages";
import {
  buildCuDestinationOptions,
  CU_CATEGORIES,
  CU_LEVELS,
  CU_TRACKS,
  type CuCategory,
  type CuLevel,
  type CuMode,
  type CuTrack,
} from "@/lib/cu/workbench";

const STORAGE_KEY = "edunancial:cu-draft";

type PreviewState = {
  path: string;
  existed: boolean;
  mergedContent: string;
};

export default function ContentUploadWorkbench() {
  const [password, setPassword] = useState("");
  const [track, setTrack] = useState<CuTrack>("RED");
  const [category, setCategory] = useState<CuCategory>("lessons");
  const [level, setLevel] = useState<CuLevel>(1);
  const [language, setLanguage] = useState("en-US");
  const [mode, setMode] = useState<CuMode>("append");
  const [content, setContent] = useState("");
  const [destination, setDestination] = useState("");
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<"preview" | "publish" | null>(null);
  const pollTimer = useRef<number | null>(null);

  const destinationOptions = useMemo(
    () => buildCuDestinationOptions({ track, category, level, language, content }),
    [track, category, level, language, content],
  );

  useEffect(() => {
    try {
      const rawDraft = window.localStorage.getItem(STORAGE_KEY);
      if (!rawDraft) {
        return;
      }
      const savedDraft = JSON.parse(rawDraft) as Partial<{
        track: CuTrack;
        category: CuCategory;
        level: CuLevel;
        language: string;
        mode: CuMode;
        content: string;
      }>;
      if (savedDraft.track) setTrack(savedDraft.track);
      if (savedDraft.category) setCategory(savedDraft.category);
      if (savedDraft.level) setLevel(savedDraft.level);
      if (savedDraft.language) setLanguage(savedDraft.language);
      if (savedDraft.mode) setMode(savedDraft.mode);
      if (savedDraft.content) setContent(savedDraft.content);
    } catch {
      // ignore invalid local drafts
    }
  }, []);

  useEffect(() => {
    if (!destinationOptions.some((option) => option.value === destination)) {
      setDestination(destinationOptions[0]?.value ?? "");
    }
  }, [destination, destinationOptions]);

  useEffect(() => {
    return () => {
      if (pollTimer.current) {
        window.clearTimeout(pollTimer.current);
      }
    };
  }, []);

  async function postJson<T>(url: string, body: Record<string, unknown>) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json() as T & { error?: string };
    if (!response.ok || result.error) {
      throw new Error(result.error || "Request failed.");
    }
    return result;
  }

  function basePayload() {
    return {
      password,
      track,
      category,
      level,
      language,
      destination,
      mode,
      content,
    };
  }

  async function handlePreview() {
    setBusyAction("preview");
    setError(null);
    setMessages([]);
    try {
      const result = await postJson<PreviewState>("/api/cu/preview", basePayload());
      setPreview(result);
    } catch (err) {
      setPreview(null);
      setError(err instanceof Error ? err.message : "Preview failed.");
    } finally {
      setBusyAction(null);
    }
  }

  function handleSave() {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ track, category, level, language, mode, content }),
    );
    setError(null);
    setMessages(["Draft saved on this device"]);
  }

  async function pollDeployment(commitSha: string) {
    try {
      const result = await postJson<{ state: string; detail: string }>("/api/cu/deploy-status", {
        password,
        commitSha,
      });

      if (result.state === "success") {
        setMessages((current) =>
          current.includes("✓ Production updated successfully")
            ? current
            : [...current, "✓ Production updated successfully"],
        );
        return;
      }

      if (result.state === "failure") {
        setError(result.detail);
        return;
      }

      pollTimer.current = window.setTimeout(() => {
        void pollDeployment(commitSha);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to confirm Netlify deployment.");
    }
  }

  async function handlePublish() {
    setBusyAction("publish");
    setError(null);
    try {
      const result = await postJson<{ path: string; mergedContent: string; commitSha: string; existed: boolean; messages: string[] }>(
        "/api/cu/publish",
        basePayload(),
      );
      setPreview({ path: result.path, existed: result.existed, mergedContent: result.mergedContent });
      setMessages(result.messages);
      void pollDeployment(result.commitSha);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed.");
    } finally {
      setBusyAction(null);
    }
  }

  const selectedDestination = destinationOptions.find((option) => option.value === destination);

  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-300">Temporary Content Upload</p>
          <h1 className="mt-3 text-4xl font-black">CU Workbench</h1>
          <p className="mt-4 max-w-3xl text-base text-slate-300">
            This temporary page is an emergency content-loading workbench for production. It does not replace the administrator dashboard.
          </p>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6 rounded-3xl border border-white/10 bg-[#0d162b] p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-200">
                <span className="font-semibold">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#08101f] px-4 py-3 text-white outline-none ring-0 transition focus:border-blue-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                <span className="font-semibold">RED / WHITE / BLUE</span>
                <select
                  value={track}
                  onChange={(event) => setTrack(event.target.value as CuTrack)}
                  className="w-full rounded-2xl border border-white/10 bg-[#08101f] px-4 py-3 text-white"
                >
                  {CU_TRACKS.map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                <span className="font-semibold">Category</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as CuCategory)}
                  className="w-full rounded-2xl border border-white/10 bg-[#08101f] px-4 py-3 text-white"
                >
                  {CU_CATEGORIES.map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                <span className="font-semibold">Level</span>
                <select
                  value={String(level)}
                  onChange={(event) => setLevel(Number(event.target.value) as CuLevel)}
                  className="w-full rounded-2xl border border-white/10 bg-[#08101f] px-4 py-3 text-white"
                >
                  {CU_LEVELS.map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                <span className="font-semibold">Language</span>
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#08101f] px-4 py-3 text-white"
                >
                  {LANGUAGE_CATALOG.map((value) => (
                    <option key={value.code} value={value.code}>{value.nativeLabel}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                <span className="font-semibold">Append / Replace</span>
                <select
                  value={mode}
                  onChange={(event) => setMode(event.target.value as CuMode)}
                  className="w-full rounded-2xl border border-white/10 bg-[#08101f] px-4 py-3 text-white"
                >
                  <option value="append">Append</option>
                  <option value="replace">Replace</option>
                </select>
              </label>
            </div>

            <label className="space-y-2 text-sm text-slate-200">
              <span className="font-semibold">Destination file selector</span>
              <select
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#08101f] px-4 py-3 text-white"
              >
                {destinationOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label} — {option.value}</option>
                ))}
              </select>
              <p className="text-xs text-slate-400">{selectedDestination?.description}</p>
            </label>

            <label className="space-y-2 text-sm text-slate-200">
              <span className="font-semibold">Paste content</span>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={18}
                className="min-h-[26rem] w-full rounded-3xl border border-white/10 bg-[#08101f] px-4 py-4 font-mono text-sm text-slate-100"
                placeholder="Paste plain text from Claude or ChatGPT here"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void handlePreview()}
                disabled={busyAction !== null}
                className="rounded-2xl border border-blue-400/50 px-5 py-3 font-semibold text-blue-100 transition hover:border-blue-300 hover:bg-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busyAction === "preview" ? "Previewing…" : "Preview"}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={busyAction !== null}
                className="rounded-2xl border border-white/15 px-5 py-3 font-semibold text-slate-100 transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => void handlePublish()}
                disabled={busyAction !== null}
                className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busyAction === "publish" ? "Publishing…" : "Publish"}
              </button>
            </div>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-[#0d162b] p-6">
            <div>
              <h2 className="text-xl font-bold">Preview</h2>
              <p className="mt-2 text-sm text-slate-400">Check the merged repository file before you publish.</p>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>
            ) : null}

            {messages.length > 0 ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                <ul className="space-y-2">
                  {messages.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="rounded-2xl border border-white/10 bg-[#08101f] p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Current target</p>
              <p className="mt-2 break-all">{destination || "Select a destination"}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#08101f] p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Final file preview</p>
              {preview ? (
                <>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                    {preview.existed ? "Existing file updated" : "New file"}
                  </p>
                  <pre className="mt-4 max-h-[32rem] overflow-auto whitespace-pre-wrap break-words font-mono text-xs text-slate-200">
                    {preview.mergedContent}
                  </pre>
                </>
              ) : (
                <p className="mt-2 text-slate-500">Use Preview to load the merged file body.</p>
              )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
