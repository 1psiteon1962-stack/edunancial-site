"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  BETA_AUDIT_STORAGE_KEY,
  BETA_FEEDBACK_STORAGE_KEY,
  BETA_INVITATIONS_STORAGE_KEY,
  createBetaAuditEntry,
  createBetaInvitation,
  extendBetaInvitation,
  markBetaInvitationSent,
  recordBetaFeedback,
  renderBetaInvitationEmail,
  revokeBetaInvitation,
  type BetaAuditEntry,
  type BetaFeedbackSubmission,
  type BetaInvitationRecord,
} from "@/lib/beta-access";

function readJson<T>(key: string): T[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeJson<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export default function BetaTestersAdminClient() {
  const [testerName, setTesterName] = useState("");
  const [approvedEmail, setApprovedEmail] = useState("");
  const [invitations, setInvitations] = useState<BetaInvitationRecord[]>([]);
  const [feedback, setFeedback] = useState<BetaFeedbackSubmission[]>([]);
  const [audit, setAudit] = useState<BetaAuditEntry[]>([]);
  const [latestEmailCopy, setLatestEmailCopy] = useState("");

  useEffect(() => {
    setInvitations(readJson<BetaInvitationRecord>(BETA_INVITATIONS_STORAGE_KEY));
    setFeedback(readJson<BetaFeedbackSubmission>(BETA_FEEDBACK_STORAGE_KEY));
    setAudit(readJson<BetaAuditEntry>(BETA_AUDIT_STORAGE_KEY));
  }, []);

  const sortedInvitations = useMemo(
    () => [...invitations].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [invitations],
  );

  async function handleCreateInvitation(event: React.FormEvent) {
    event.preventDefault();
    if (!testerName.trim() || !approvedEmail.trim()) {
      return;
    }

    const { invitation, passNumber, auditEntry } = await createBetaInvitation({
      testerName,
      approvedEmail,
      existingInvitations: invitations,
    });

    const nextInvitations = [invitation, ...invitations];
    const nextAudit = [auditEntry, ...audit];
    setInvitations(nextInvitations);
    setAudit(nextAudit);
    writeJson(BETA_INVITATIONS_STORAGE_KEY, nextInvitations);
    writeJson(BETA_AUDIT_STORAGE_KEY, nextAudit);
    setLatestEmailCopy(
      renderBetaInvitationEmail({
        testerName: invitation.testerName,
        approvedEmail: invitation.approvedEmail,
        passNumber,
      }).text,
    );
    setTesterName("");
    setApprovedEmail("");
  }

  function updateInvitation(invitationId: string, nextInvitation: BetaInvitationRecord, action: string) {
    const nextInvitations = invitations.map((invitation) =>
      invitation.id === invitationId ? nextInvitation : invitation,
    );
    const nextAuditEntry = createBetaAuditEntry(invitationId, "admin", action);
    const nextAudit = [nextAuditEntry, ...audit];

    setInvitations(nextInvitations);
    setAudit(nextAudit);
    writeJson(BETA_INVITATIONS_STORAGE_KEY, nextInvitations);
    writeJson(BETA_AUDIT_STORAGE_KEY, nextAudit);
  }

  function downloadFeedbackExport() {
    const blob = new Blob([JSON.stringify(feedback, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "edunancial-beta-feedback.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">Administration</p>
            <h1 className="mt-3 text-5xl font-black">Beta Tester Management</h1>
            <p className="mt-3 max-w-3xl text-slate-400">
              Create invitation-only beta access, copy the invitation email, inspect activation
              timing, revoke access, extend access explicitly, and review feedback.
            </p>
          </div>
          <Link href="/admin" className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold hover:border-white">
            ← All Modules
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border border-white/10 bg-[#101a2f] p-8">
            <h2 className="text-2xl font-black">Create Beta Invitation</h2>
            <form className="mt-6 space-y-4" onSubmit={handleCreateInvitation}>
              <input
                value={testerName}
                onChange={(event) => setTesterName(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                placeholder="Tester name"
              />
              <input
                value={approvedEmail}
                onChange={(event) => setApprovedEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                placeholder="approved@example.com"
                type="email"
              />
              <button className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-500" type="submit">
                Generate invitation
              </button>
            </form>

            <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
              <h3 className="text-lg font-bold">Latest invitation email copy</h3>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                {latestEmailCopy || "Generate an invitation to copy the one-time email template with the pass number."}
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#101a2f] p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black">Invitations</h2>
              <p className="text-sm text-slate-400">{sortedInvitations.length} total</p>
            </div>
            <div className="mt-6 space-y-4">
              {sortedInvitations.map((invitation) => (
                <article key={invitation.id} className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black">{invitation.testerName}</h3>
                      <p className="mt-2 text-sm text-slate-300">{invitation.approvedEmail}</p>
                      <p className="mt-2 text-xs text-slate-500">Pass number: {invitation.passNumberMasked}</p>
                    </div>
                    <span className="rounded-full border border-slate-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-200">
                      {invitation.status}
                    </span>
                  </div>

                  <dl className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                    <div><dt className="text-slate-500">Created</dt><dd>{invitation.createdAt}</dd></div>
                    <div><dt className="text-slate-500">Redeemed</dt><dd>{invitation.redeemedAt ?? "Not yet"}</dd></div>
                    <div><dt className="text-slate-500">First login</dt><dd>{invitation.firstLoginAt ?? "Not yet"}</dd></div>
                    <div><dt className="text-slate-500">Expires</dt><dd>{invitation.betaExpiresAt ?? "Pending first login"}</dd></div>
                    <div><dt className="text-slate-500">Feedback</dt><dd>{invitation.feedbackSubmittedAt ?? "Pending"}</dd></div>
                    <div><dt className="text-slate-500">Sent</dt><dd>{invitation.sentAt ?? "Not marked"}</dd></div>
                  </dl>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => updateInvitation(invitation.id, markBetaInvitationSent(invitation), "beta.invitation.sent")}
                      className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold hover:border-white"
                    >
                      Mark Sent
                    </button>
                    <button
                      type="button"
                      onClick={() => updateInvitation(invitation.id, extendBetaInvitation(invitation, 72), "beta.invitation.extended")}
                      className="rounded-lg border border-blue-500/60 px-4 py-2 text-sm font-semibold text-blue-200 hover:bg-blue-500/10"
                    >
                      Extend 72 Hours
                    </button>
                    <button
                      type="button"
                      onClick={() => updateInvitation(invitation.id, revokeBetaInvitation(invitation), "beta.invitation.revoked")}
                      className="rounded-lg border border-red-500/60 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/10"
                    >
                      Revoke
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-[#101a2f] p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black">Feedback</h2>
              <button
                type="button"
                onClick={downloadFeedbackExport}
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold hover:border-white"
              >
                Export JSON
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {feedback.length === 0 ? (
                <p className="text-sm text-slate-400">No beta feedback has been submitted yet.</p>
              ) : (
                feedback.map((entry) => (
                  <article key={entry.id} className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm font-semibold text-slate-200">{entry.email}</p>
                    <p className="mt-2 text-sm text-slate-400">Rating: {entry.rating}/5 · {entry.submittedAt}</p>
                    <p className="mt-3 text-sm text-slate-300">{entry.strongestFeature}</p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#101a2f] p-8">
            <h2 className="text-2xl font-black">Audit History</h2>
            <div className="mt-6 space-y-3">
              {audit.length === 0 ? (
                <p className="text-sm text-slate-400">No beta audit events recorded yet.</p>
              ) : (
                audit.slice(0, 20).map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-sm text-slate-300">
                    <p className="font-semibold text-white">{entry.action}</p>
                    <p className="mt-1 text-slate-400">{entry.timestamp}</p>
                    <p className="mt-1 text-slate-500">Actor: {entry.actor}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
