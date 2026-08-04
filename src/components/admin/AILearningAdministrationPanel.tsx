"use client";

import { useEffect, useMemo, useState } from "react";

import {
  AI_LEARNING_ADMIN_STORAGE_KEY,
  DEFAULT_AI_LEARNING_CONFIG,
  mergeAILearningConfig,
  type AILearningAdminConfig,
} from "@/lib/ai-learning/config";

const TRACK_OPTIONS = ["RED", "WHITE", "BLUE"] as const;

function parseListInput(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AILearningAdministrationPanel() {
  const [config, setConfig] = useState<AILearningAdminConfig>(DEFAULT_AI_LEARNING_CONFIG);
  const [disabledLessonsInput, setDisabledLessonsInput] = useState("");
  const [jurisdictionsInput, setJurisdictionsInput] = useState("");
  const [languagesInput, setLanguagesInput] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AI_LEARNING_ADMIN_STORAGE_KEY);
      const loaded = mergeAILearningConfig(raw ? (JSON.parse(raw) as Partial<AILearningAdminConfig>) : null);
      setConfig(loaded);
      setDisabledLessonsInput(loaded.disabledLessons.join(", "));
      setJurisdictionsInput(loaded.supportedJurisdictions.join(", "));
      setLanguagesInput(loaded.supportedLanguages.join(", "));
    } catch {
      setConfig(DEFAULT_AI_LEARNING_CONFIG);
      setDisabledLessonsInput(DEFAULT_AI_LEARNING_CONFIG.disabledLessons.join(", "));
      setJurisdictionsInput(DEFAULT_AI_LEARNING_CONFIG.supportedJurisdictions.join(", "));
      setLanguagesInput(DEFAULT_AI_LEARNING_CONFIG.supportedLanguages.join(", "));
    }
  }, []);

  const trackSet = useMemo(() => new Set(config.enabledTracks), [config.enabledTracks]);

  const save = () => {
    const next = mergeAILearningConfig({
      ...config,
      disabledLessons: parseListInput(disabledLessonsInput),
      supportedJurisdictions: parseListInput(jurisdictionsInput),
      supportedLanguages: parseListInput(languagesInput),
    });

    setConfig(next);
    localStorage.setItem(AI_LEARNING_ADMIN_STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Admin</p>
        <h1 className="mt-2 text-4xl font-black">AI Learning Network</h1>
        <p className="mt-3 text-slate-300">
          Configure global AI enablement, curriculum/lesson controls, and supported jurisdictions/languages.
        </p>

        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <h2 className="text-xl font-bold">Global Controls</h2>
            <div className="mt-4 space-y-3 text-sm">
              <label className="flex items-center justify-between gap-4">
                <span>Enable AI Learning Network globally</span>
                <input
                  type="checkbox"
                  checked={config.enabledGlobally}
                  onChange={(event) =>
                    setConfig((previous) => ({ ...previous, enabledGlobally: event.target.checked }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-4">
                <span>Allow public/free visitor assistance</span>
                <input
                  type="checkbox"
                  checked={config.publicAssistanceEnabled}
                  onChange={(event) =>
                    setConfig((previous) => ({ ...previous, publicAssistanceEnabled: event.target.checked }))
                  }
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <h2 className="text-xl font-bold">Curriculum Track Enablement</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {TRACK_OPTIONS.map((track) => (
                <label key={track} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0a1020] px-4 py-3 text-sm">
                  <span>{track}</span>
                  <input
                    type="checkbox"
                    checked={trackSet.has(track)}
                    onChange={(event) => {
                      setConfig((previous) => {
                        const nextSet = new Set(previous.enabledTracks);
                        if (event.target.checked) {
                          nextSet.add(track);
                        } else {
                          nextSet.delete(track);
                        }
                        return { ...previous, enabledTracks: Array.from(nextSet) };
                      });
                    }}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <h2 className="text-xl font-bold">Lesson-Level Disable List</h2>
            <p className="mt-2 text-sm text-slate-400">Comma-separated lesson IDs (example: BLUE-L1-001, RED-L2-004).</p>
            <textarea
              rows={3}
              value={disabledLessonsInput}
              onChange={(event) => setDisabledLessonsInput(event.target.value)}
              className="mt-3 w-full rounded-xl border border-white/10 bg-[#0a1020] p-3 text-sm"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <h2 className="text-xl font-bold">Jurisdictions</h2>
            <p className="mt-2 text-sm text-slate-400">Comma-separated ISO or region keys (US, CA, MX, EU...).</p>
            <textarea
              rows={3}
              value={jurisdictionsInput}
              onChange={(event) => setJurisdictionsInput(event.target.value)}
              className="mt-3 w-full rounded-xl border border-white/10 bg-[#0a1020] p-3 text-sm"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <h2 className="text-xl font-bold">Languages</h2>
            <p className="mt-2 text-sm text-slate-400">Comma-separated locale codes (en-US, es, fr-CA...).</p>
            <textarea
              rows={3}
              value={languagesInput}
              onChange={(event) => setLanguagesInput(event.target.value)}
              className="mt-3 w-full rounded-xl border border-white/10 bg-[#0a1020] p-3 text-sm"
            />
          </div>

          <button
            type="button"
            onClick={save}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold hover:bg-blue-500"
          >
            Save AI Configuration
          </button>
        </div>
      </section>
    </main>
  );
}
