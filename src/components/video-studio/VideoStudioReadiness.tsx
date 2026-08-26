"use client";

import { useCallback, useEffect, useState } from "react";

type ReadinessCheck = {
  id: string;
  label: string;
  ok: boolean;
  detail: string;
};

type ReadinessPayload = {
  success: boolean;
  ready: boolean;
  checkedAt: string;
  checks: ReadinessCheck[];
  error?: string;
};

export default function VideoStudioReadiness() {
  const [payload, setPayload] = useState<ReadinessPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/video/readiness", { cache: "no-store" });
      const data = (await response.json().catch(() => ({}))) as ReadinessPayload;
      if (!response.ok || data.success === false) {
        throw new Error(data.error || `Readiness check failed (${response.status}).`);
      }
      setPayload(data);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not check Video Studio readiness.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-300">Production readiness</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-black">Video Pipeline</h2>
            {payload ? (
              <span className={`rounded-full px-3 py-1 text-xs font-black ${payload.ready ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-200"}`}>
                {payload.ready ? "READY TO RENDER" : "SETUP REQUIRED"}
              </span>
            ) : null}
          </div>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">
            This checks the actual database, private video storage, worker configuration, and worker health before a render is attempted.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-slate-200 disabled:opacity-50"
        >
          {loading ? "Checking…" : "Run readiness check"}
        </button>
      </div>

      {error ? (
        <div className="mt-5 rounded-xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-200">{error}</div>
      ) : null}

      {payload ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {payload.checks.map((check) => (
            <div key={check.id} className={`rounded-2xl border p-4 ${check.ok ? "border-emerald-400/20 bg-emerald-950/15" : "border-amber-400/25 bg-amber-950/20"}`}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-bold text-white">{check.label}</p>
                <span className={`text-xs font-black ${check.ok ? "text-emerald-300" : "text-amber-200"}`}>
                  {check.ok ? "PASS" : "ACTION NEEDED"}
                </span>
              </div>
              <p className="mt-2 break-words text-xs leading-5 text-slate-400">{check.detail}</p>
            </div>
          ))}
        </div>
      ) : null}

      {payload?.ready ? (
        <p className="mt-5 rounded-xl border border-emerald-400/25 bg-emerald-950/20 p-4 text-sm font-bold text-emerald-200">
          All required Video Studio services are available. A sample render can be attempted.
        </p>
      ) : payload ? (
        <p className="mt-5 rounded-xl border border-amber-400/25 bg-amber-950/20 p-4 text-sm text-amber-100">
          Render is not yet fully production-ready. Correct the items marked Action Needed, then run this check again.
        </p>
      ) : null}
    </section>
  );
}
