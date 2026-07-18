"use client";

import { useMemo, useState } from "react";

import { useAuth } from "@/lib/authContext";
import {
  BETA_AUDIT_STORAGE_KEY,
  BETA_FEEDBACK_STORAGE_KEY,
  BETA_INVITATIONS_STORAGE_KEY,
  createBetaAuditEntry,
  recordBetaFeedback,
  type BetaAuditEntry,
  type BetaFeedbackSubmission,
  type BetaInvitationRecord,
} from "@/lib/beta-access";

function readJson<T>(key: string): T[] {
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

export default function BetaFeedbackPage() {
  const { user, updateProfile } = useAuth();
  const [statusMessage, setStatusMessage] = useState("");
  const [rating, setRating] = useState("5");
  const [countryRegion, setCountryRegion] = useState("");
  const [strongestFeature, setStrongestFeature] = useState("");
  const [improvementRequest, setImprovementRequest] = useState("");
  const [confusingMoment, setConfusingMoment] = useState("");
  const [practicalOutcome, setPracticalOutcome] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const invitation = useMemo(() => {
    if (!user) {
      return null;
    }

    return readJson<BetaInvitationRecord>(BETA_INVITATIONS_STORAGE_KEY).find(
      (candidate) => candidate.id === user.betaAccess?.invitationId,
    ) ?? null;
  }, [user]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user || !invitation) {
      setStatusMessage("Beta invitation not found for this account.");
      return;
    }

    const { invitation: updatedInvitation, submission } = recordBetaFeedback(
      invitation,
      {
        id: `feedback-${Date.now()}`,
        testerId: user.id,
        email: user.email,
        countryRegion: countryRegion || undefined,
        rating: Number(rating),
        strongestFeature,
        improvementRequest,
        confusingMoment,
        practicalOutcome,
        additionalNotes: additionalNotes || undefined,
      },
    );

    const invitations = readJson<BetaInvitationRecord>(BETA_INVITATIONS_STORAGE_KEY).map((candidate) =>
      candidate.id === invitation.id ? updatedInvitation : candidate,
    );
    const feedback = [submission, ...readJson<BetaFeedbackSubmission>(BETA_FEEDBACK_STORAGE_KEY)];
    const auditEntries = [
      createBetaAuditEntry(invitation.id, user.email, "beta.feedback.submitted"),
      ...readJson<BetaAuditEntry>(BETA_AUDIT_STORAGE_KEY),
    ];

    writeJson(BETA_INVITATIONS_STORAGE_KEY, invitations);
    writeJson(BETA_FEEDBACK_STORAGE_KEY, feedback);
    writeJson(BETA_AUDIT_STORAGE_KEY, auditEntries);
    updateProfile({
      betaAccess: user.betaAccess
        ? {
            ...user.betaAccess,
            feedbackSubmittedAt: updatedInvitation.feedbackSubmittedAt,
          }
        : user.betaAccess,
    });
    setStatusMessage("Thank you. Your beta feedback has been recorded.");
  }

  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-950/80 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.4em] text-emerald-300">Beta Feedback</p>
        <h1 className="mt-4 text-4xl font-black">Tell us what worked and what needs work</h1>
        <p className="mt-4 text-slate-300">
          We store your tester ID, approved email address, submission time, optional country or
          region, rating, and your written responses so the platform can improve without collecting
          unnecessary sensitive information.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold">
            Overall rating
            <select
              value={rating}
              onChange={(event) => setRating(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            >
              {["5", "4", "3", "2", "1"].map((value) => (
                <option key={value} value={value}>
                  {value} / 5
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold">
            Country or region <span className="text-slate-500">(optional)</span>
            <input
              value={countryRegion}
              onChange={(event) => setCountryRegion(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />
          </label>

          <TextareaField label="What was the strongest part of the beta experience?" value={strongestFeature} onChange={setStrongestFeature} />
          <TextareaField label="What should we improve before wider release?" value={improvementRequest} onChange={setImprovementRequest} />
          <TextareaField label="What felt confusing or slowed you down?" value={confusingMoment} onChange={setConfusingMoment} />
          <TextareaField label="What practical financial outcome did the platform help you with?" value={practicalOutcome} onChange={setPracticalOutcome} />
          <TextareaField label="Anything else you want the team to know?" value={additionalNotes} onChange={setAdditionalNotes} required={false} />

          <button className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-400" type="submit">
            Submit Feedback
          </button>
        </form>

        {statusMessage && <p className="mt-5 text-sm text-emerald-300">{statusMessage}</p>}
      </div>
    </main>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <textarea
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-28 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
      />
    </label>
  );
}
