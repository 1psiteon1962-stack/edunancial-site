"use client";

import { useEffect, useState } from "react";

type ActiveUploadMode = "signed-supabase" | "anon-supabase" | "legacy-local" | "unavailable";

type DiagnosticsResult = {
  supabaseUrlConfigured: boolean;
  anonKeyConfigured: boolean;
  serviceRoleConfigured: boolean;
  storageBucketConfigured: boolean;
  storageBucketName: string | null;
  bucketReachable: boolean;
  signedUploadAvailable: boolean;
  githubTokenConfigured: boolean;
  githubOwnerConfigured: boolean;
  githubRepoConfigured: boolean;
  githubOwner: string | null;
  githubRepo: string | null;
  githubRepositoryReachable: boolean;
  activeUploadMode: ActiveUploadMode;
  netlifySafeUploadLimitBytes: number;
  productionReady: boolean;
  problems: string[];
};

const MODE_LABELS: Record<ActiveUploadMode, string> = {
  "signed-supabase": "Signed Supabase upload (recommended)",
  "anon-supabase": "Direct Supabase upload (anon key)",
  "legacy-local": "Legacy local upload (development only)",
  unavailable: "Upload unavailable",
};

export default function DiagnosticsPanel() {
  const [result, setResult] = useState<DiagnosticsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/admin/content/diagnostics", { cache: "no-store" });
        if (!response.ok) {
          setFetchError(`Diagnostics request failed (HTTP ${response.status}).`);
          return;
        }
        setResult((await response.json()) as DiagnosticsResult);
      } catch (err) {
        setFetchError((err as Error).message ?? "Could not load diagnostics.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0d1526] px-6 py-4 text-sm text-slate-400 animate-pulse">
        Checking upload configuration…
      </div>
    );
  }

  if (fetchError || !result) {
    return (
      <div className="rounded-2xl border border-yellow-500/40 bg-[#0d1526] px-6 py-4">
        <p className="text-sm text-yellow-400">⚠ Could not load diagnostics: {fetchError ?? "Unknown error"}</p>
      </div>
    );
  }

  const ready = result.productionReady;

  return (
    <div
      className={`rounded-2xl border px-6 py-5 text-sm ${ready ? "border-green-500/40 bg-green-950/20" : "border-red-500/40 bg-red-950/20"}`}
    >
      <div className="flex items-start gap-3">
        <span className={`text-lg leading-none ${ready ? "text-green-400" : "text-red-400"}`}>
          {ready ? "✔" : "✘"}
        </span>
        <div className="flex-1">
          <p className={`font-bold ${ready ? "text-green-300" : "text-red-300"}`}>
            {ready
              ? "READY — Supabase signed upload and GitHub publishing are connected."
              : "BLOCKED — Upload is not fully configured."}
          </p>
          <p className="mt-1 text-slate-400">
            Active upload mode:{" "}
            <span className="font-mono text-slate-200">{MODE_LABELS[result.activeUploadMode]}</span>
          </p>
          {result.storageBucketName && (
            <p className="mt-1 text-slate-400">
              Storage bucket:{" "}
              <span className="font-mono text-slate-200">{result.storageBucketName}</span>{" "}
              {result.bucketReachable ? (
                <span className="text-green-400">✔ reachable</span>
              ) : (
                <span className="text-red-400">✘ not reachable</span>
              )}
            </p>
          )}
          {(result.githubOwner || result.githubRepo) && (
            <p className="mt-1 text-slate-400">
              GitHub:{" "}
              <span className="font-mono text-slate-200">
                {result.githubOwner}/{result.githubRepo}
              </span>{" "}
              {result.githubRepositoryReachable ? (
                <span className="text-green-400">✔ reachable</span>
              ) : (
                <span className="text-red-400">✘ not reachable</span>
              )}
            </p>
          )}
          {result.problems.length > 0 && (
            <ul className="mt-3 space-y-1">
              {result.problems.map((problem, index) => (
                <li key={index} className="flex items-start gap-2 text-red-300">
                  <span className="mt-0.5 flex-shrink-0 text-red-400">•</span>
                  {problem}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
