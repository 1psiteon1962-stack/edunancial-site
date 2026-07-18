"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[Admin] PRODUCTION RUNTIME ERROR", {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    });
  }, [error]);

  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-16 text-white">
      <div className="mx-auto max-w-2xl rounded-2xl border border-red-500/40 bg-red-950/30 p-8">
        <h1 className="text-2xl font-black text-red-400">PRODUCTION RUNTIME ERROR</h1>
        <dl className="mt-6 space-y-4 text-sm">
          <div>
            <dt className="font-bold text-slate-300">Exception:</dt>
            <dd className="mt-1 rounded bg-slate-900 px-3 py-2 font-mono text-red-300">{error.message || "Unknown error"}</dd>
          </div>
          {error.digest && (
            <div>
              <dt className="font-bold text-slate-300">Digest:</dt>
              <dd className="mt-1 rounded bg-slate-900 px-3 py-2 font-mono text-slate-400">{error.digest}</dd>
            </div>
          )}
          {error.stack && (
            <div>
              <dt className="font-bold text-slate-300">Stack:</dt>
              <dd className="mt-1 overflow-auto rounded bg-slate-900 px-3 py-2 font-mono text-xs text-slate-400 whitespace-pre-wrap">
                {error.stack}
              </dd>
            </div>
          )}
        </dl>
        <button
          onClick={reset}
          className="mt-8 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
