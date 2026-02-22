"use client";

import React, { useState } from "react";
import type { FounderStage } from "@/lib/diagnostic/types";
import {
  DEFAULT_REGION,
  INDUSTRY_OPTIONS,
  STAGE_OPTIONS,
  normalizeEmail,
  isValidEmail,
  normalizeRegion,
} from "@/lib/diagnostic/constants";

type Props = {
  regionFromRoute?: string;
};

export default function DiagnosticFlow({ regionFromRoute }: Props) {
  const region = normalizeRegion(regionFromRoute || DEFAULT_REGION);

  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<FounderStage>("pre_revenue");
  const [industry, setIndustry] = useState<string>(INDUSTRY_OPTIONS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSubmitting(true);
    setError(null);

    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) {
      setSubmitting(false);
      setError("Please enter a valid email.");
      return;
    }

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalized,
          region,
          stage,
          industry,
          answers: [],
          clientTs: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (!data.ok) throw new Error(data.error || "Submission failed.");

      alert("Diagnostic submitted successfully.");
    } catch (e: any) {
      setError(e?.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="rounded-2xl border p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Founder Diagnostic</h1>
        <p className="mt-2 text-sm text-gray-600">
          Structured readiness evaluation by region and stage.
        </p>

        {error && (
          <div className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Stage</label>
          <select
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
            value={stage}
            onChange={(e) => setStage(e.target.value as FounderStage)}
          >
            {STAGE_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Industry</label>
          <select
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          >
            {INDUSTRY_OPTIONS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <button
          className="mt-6 w-full rounded bg-black px-4 py-2 text-sm text-white"
          disabled={submitting}
          onClick={submit}
        >
          {submitting ? "Submitting..." : "Submit Diagnostic"}
        </button>
      </div>
    </div>
  );
}
