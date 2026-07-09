"use client";

import { useMemo, useState } from "react";

import { WorkflowBadge } from "@/components/content/WorkflowBadge";
import { getSeoScore } from "@/lib/content/seo";
import {
  evaluateWorkflowTransition,
  getAvailableWorkflowTargets,
} from "@/lib/content/workflow";
import type {
  AIReviewItem,
  ContentArticle,
  ContentState,
  EditorialActorRole,
} from "@/lib/content/types";

interface WorkspaceArticle extends ContentArticle {
  suggestions: AIReviewItem[];
}

const ROLE_OPTIONS: EditorialActorRole[] = [
  "author",
  "editor",
  "seoSpecialist",
  "factChecker",
  "legalReviewer",
  "managingEditor",
  "publisher",
];

export function EditorialWorkspace({ articles }: { articles: WorkspaceArticle[] }) {
  const [selectedSlug, setSelectedSlug] = useState(articles[0]?.slug ?? "");
  const [selectedRole, setSelectedRole] = useState<EditorialActorRole>("managingEditor");
  const [scheduledFor, setScheduledFor] = useState("2026-07-20T14:00");
  const [resultMessage, setResultMessage] = useState<string>("");
  const [suggestionState, setSuggestionState] = useState<Record<string, AIReviewItem[]>>(
    Object.fromEntries(articles.map((article) => [article.slug, article.suggestions]))
  );

  const selectedArticle = useMemo(
    () => articles.find((article) => article.slug === selectedSlug) ?? articles[0],
    [articles, selectedSlug]
  );

  const availableTargets = useMemo(
    () => (selectedArticle ? getAvailableWorkflowTargets(selectedArticle, selectedRole) : []),
    [selectedArticle, selectedRole]
  );

  if (!selectedArticle) {
    return null;
  }

  function handleTransition(nextState: ContentState) {
    const result = evaluateWorkflowTransition({
      article: selectedArticle,
      nextState,
      actorName: "Dashboard Preview",
      actorRole: selectedRole,
      scheduledFor: nextState === "scheduled" ? new Date(scheduledFor).toISOString() : undefined,
    });

    setResultMessage(
      result.allowed
        ? `Transition allowed: ${selectedArticle.status} → ${nextState}.`
        : result.reasons.join(" ")
    );
  }

  function updateSuggestion(slug: string, suggestionId: string, value: string) {
    setSuggestionState((current) => ({
      ...current,
      [slug]: current[slug].map((suggestion) =>
        suggestion.id === suggestionId
          ? { ...suggestion, content: value, status: suggestion.content === value ? suggestion.status : "edited" }
          : suggestion
      ),
    }));
  }

  const seoScore = getSeoScore(selectedArticle);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#0d1729] p-6 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Editorial workspace</p>
          <h2 className="mt-3 text-3xl font-black text-white">Human review remains in control</h2>
          <p className="mt-3 max-w-3xl text-slate-300">
            AI suggestions are editable, workflow transitions stay permission-aware, and publication cannot bypass approval gates.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm text-slate-200">
            Article
            <select
              value={selectedSlug}
              onChange={(event) => setSelectedSlug(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-[#111d35] px-4 py-3 text-white"
            >
              {articles.map((article) => (
                <option key={article.slug} value={article.slug}>
                  {article.title}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-200">
            Acting role
            <select
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.target.value as EditorialActorRole)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-[#111d35] px-4 py-3 text-white"
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-200">
            Schedule preview
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(event) => setScheduledFor(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-[#111d35] px-4 py-3 text-white"
            />
          </label>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <article className="rounded-3xl border border-white/10 bg-[#101a2f] p-6">
            <div className="flex flex-wrap items-center gap-3">
              <WorkflowBadge state={selectedArticle.status} />
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200">
                SEO score {seoScore}
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-black text-white">{selectedArticle.title}</h3>
            <p className="mt-3 text-slate-300">{selectedArticle.excerpt}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Approvals</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                  {selectedArticle.approvals.length > 0 ? (
                    selectedArticle.approvals.map((approval) => (
                      <li key={`${approval.role}-${approval.reviewer}`}>{approval.role}: {approval.reviewer}</li>
                    ))
                  ) : (
                    <li>No approvals recorded yet.</li>
                  )}
                </ul>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Collaborators</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                  {selectedArticle.collaborators.map((collaborator) => (
                    <li key={collaborator.id}>{collaborator.name} · {collaborator.role}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {availableTargets.map((nextState) => (
                <button
                  key={nextState}
                  type="button"
                  onClick={() => handleTransition(nextState)}
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  Move to {nextState}
                </button>
              ))}
            </div>
            {resultMessage ? (
              <p className="mt-4 rounded-2xl border border-white/10 bg-[#0b1220] p-4 text-sm text-slate-200">
                {resultMessage}
              </p>
            ) : null}
          </article>

          <section className="rounded-3xl border border-white/10 bg-[#101a2f] p-6">
            <h3 className="text-2xl font-black text-white">AI review queue</h3>
            <p className="mt-2 text-slate-300">Every suggestion is reviewable and editable before human approval.</p>
            <div className="mt-6 space-y-4">
              {suggestionState[selectedArticle.slug].map((suggestion) => (
                <article key={suggestion.id} className="rounded-2xl border border-white/10 bg-[#0b1220] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{suggestion.title}</h4>
                      <p className="text-sm text-slate-400">{suggestion.summary}</p>
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                      {suggestion.status}
                    </span>
                  </div>
                  <textarea
                    value={suggestion.content}
                    onChange={(event) => updateSuggestion(selectedArticle.slug, suggestion.id, event.target.value)}
                    className="mt-4 min-h-28 w-full rounded-2xl border border-white/10 bg-[#111d35] px-4 py-3 text-sm text-white"
                    aria-label={`${suggestion.title} editor`}
                  />
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-[#101a2f] p-6">
            <h3 className="text-xl font-black text-white">SEO quality monitor</h3>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-cyan-400" style={{ width: `${seoScore}%` }} />
            </div>
            <p className="mt-3 text-sm text-slate-300">
              Articles need a score of 85+ before scheduling or publication.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#101a2f] p-6">
            <h3 className="text-xl font-black text-white">Publication history</h3>
            <ol className="mt-4 space-y-4 border-l border-white/10 pl-4 text-sm text-slate-300">
              {selectedArticle.publicationHistory.map((entry) => (
                <li key={`${entry.state}-${entry.changedAt}`}>
                  <p className="font-semibold text-white">{entry.state}</p>
                  <p>{new Date(entry.changedAt).toLocaleString()}</p>
                  <p className="text-slate-400">{entry.changedBy} — {entry.note}</p>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </section>
  );
}
