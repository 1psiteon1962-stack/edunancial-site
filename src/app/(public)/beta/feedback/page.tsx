"use client";

import { useState } from "react";

import { useAuth } from "@/lib/authContext";

export default function BetaFeedbackPage() {
  const { user, csrfToken } = useAuth();
  const [statusMessage, setStatusMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState("5");
  const [countryRegion, setCountryRegion] = useState("");
  const [strongestFeature, setStrongestFeature] = useState("");
  const [improvementRequest, setImprovementRequest] = useState("");
  const [confusingMoment, setConfusingMoment] = useState("");
  const [practicalOutcome, setPracticalOutcome] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user) {
      setStatusMessage("Please sign in with your beta account to send feedback.");
      return;
    }
    setSubmitting(true);
    setStatusMessage("");
    try {
      const response = await fetch("/api/member/beta-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken ?? "" },
        body: JSON.stringify({ rating: Number(rating), countryRegion, strongestFeature, improvementRequest, confusingMoment, practicalOutcome, additionalNotes }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setStatusMessage(payload.error ?? "Feedback could not be sent. Please try again.");
        return;
      }
      setStatusMessage("Thank you. Your beta feedback was sent to the Edunancial team.");
    } catch {
      setStatusMessage("Network error. Your feedback was not sent; please try again.");
    } finally {
      setSubmitting(false);
    }
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

          <button disabled={submitting} className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50" type="submit">
            {submitting ? "Sending…" : "Submit Feedback"}
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
