"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Upload = { uploadId: string; originalFilename: string; sizeBytes: number; storagePath: string };
type RecoverableBatch = { batchId: string; uploads: Upload[] };
type RecoveryResponse = { recoverable?: RecoverableBatch[]; recoveryAvailable?: boolean; warning?: string; error?: string };

export default function RecoveryClient() {
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState("");
  const [batches, setBatches] = useState<RecoverableBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [recoveryAvailable, setRecoveryAvailable] = useState(true);
  const [progress, setProgress] = useState("");

  async function load(options: { preserveError?: boolean } = {}) {
    setLoading(true);
    if (!options.preserveError) setError("");
    setWarning("");
    try {
      const [sessionResponse, recoveryResponse] = await Promise.all([
        fetch("/api/admin/auth/session", { cache: "no-store" }),
        fetch("/api/admin/content/upload/recover", { cache: "no-store" }),
      ]);
      const session = await sessionResponse.json();
      const recovery = await recoveryResponse.json() as RecoveryResponse;
      if (!recoveryResponse.ok) throw new Error(recovery.error ?? "Unable to inspect interrupted uploads.");
      setCsrfToken(session.csrfToken ?? "");
      setBatches(recovery.recoverable ?? []);
      setRecoveryAvailable(recovery.recoveryAvailable !== false);
      setWarning(recovery.warning ?? "");
    } catch (err) {
      setRecoveryAvailable(false);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function recoverRequest(batchId: string, uploadId: string) {
    const response = await fetch("/api/admin/content/upload/recover", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken },
      body: JSON.stringify({ batchId, uploadId }),
    });
    const responseText = await response.text();
    let payload: any = null;
    if (responseText.trim()) {
      try {
        payload = JSON.parse(responseText);
      } catch {
        // A long-running recovery may finish server-side after the HTTP
        // response is truncated. Treat this as ambiguous and reconcile from
        // persistent storage rather than reporting a JSON parser failure.
      }
    }
    if (!response.ok && payload) {
      const details = [payload.error, payload.reason, payload.detail, payload.controlledDecision?.reason, payload.executionDecision?.reason].filter(Boolean);
      throw new Error(details.join(" — ") || `Recovery failed (HTTP ${response.status}).`);
    }
    if (!payload) return { reconciliationRequired: true };
    return payload;
  }

  async function recover(batchId: string, uploadId: string) {
    if (!recoveryAvailable) return;
    const key = `${batchId}:${uploadId}`;
    setActive(key);
    setError("");
    setProgress("");
    try {
      const payload = await recoverRequest(batchId, uploadId);
      if (payload.reconciliationRequired) {
        setProgress("Recovery response was interrupted. Reconciling the stored package from persistent server state; do not retry or re-upload it.");
        await load({ preserveError: true });
        setProgress("Recovery response was interrupted. Persistent storage has been reconciled. If the package remains listed, it is preserved for a safe server-side retry; if it disappears, recovery completed durably.");
        return;
      }
      router.push(`/admin/content/batches/${payload.batch.id}`);
      router.refresh();
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      setProgress("Recovery did not complete. The stored ZIP is preserved; the error below is the server response.");
      await load({ preserveError: true });
      setError(message);
    } finally {
      setActive(null);
    }
  }

  function recoverAll() {
    setError("Recover All is disabled during the curriculum consolidation freeze.");
  }

  const totalUploads = batches.reduce((sum, batch) => sum + batch.uploads.length, 0);

  if (loading) return <p className="text-sm text-slate-400">Checking for interrupted stored uploads...</p>;

  return (
    <section className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-amber-100">Recover interrupted uploads</h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-300">These files already reached storage but did not record a successful finalization. Recovery finalizes each stored package independently without uploading it again. Trusted 50-lesson curriculum packages publish automatically after validation; a failure in one package does not erase the stored files.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {recoveryAvailable && totalUploads > 0 ? <button type="button" disabled className="rounded-lg bg-emerald-300 px-4 py-2 text-sm font-black text-slate-950 disabled:opacity-50">Recover All disabled during consolidation</button> : null}
          <button type="button" disabled={Boolean(active)} onClick={() => void load()} className="rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold disabled:opacity-50">Refresh</button>
        </div>
      </div>
      {progress ? <p className="mt-4 rounded-lg bg-slate-950/40 p-3 text-sm text-slate-200">{progress}</p> : null}
      {warning ? <p className="mt-4 rounded-lg border border-amber-300/25 bg-amber-950/30 p-3 text-sm text-amber-100">{warning}</p> : null}
      {error ? <p className="mt-4 rounded-lg bg-red-950/50 p-3 text-sm text-red-200">{error}</p> : null}
      {recoveryAvailable && !batches.length ? <p className="mt-4 text-sm text-emerald-200">No interrupted stored uploads currently need recovery.</p> : null}
      {!recoveryAvailable && !warning && !error ? <p className="mt-4 text-sm text-amber-100">Interrupted-upload recovery is temporarily unavailable. New uploads are not blocked by this recovery status.</p> : null}
      <div className="mt-4 space-y-4">
        {batches.map((batch) => (
          <div key={batch.batchId} className="rounded-xl border border-white/10 bg-[#0b1426] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Original batch {batch.batchId}</p>
            <div className="mt-3 space-y-2">
              {batch.uploads.map((upload) => {
                const key = `${batch.batchId}:${upload.uploadId}`;
                return <div key={upload.uploadId} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white/5 p-3">
                  <div><p className="font-semibold text-white">{upload.originalFilename}</p><p className="text-xs text-slate-400">{(upload.sizeBytes / 1024 / 1024).toFixed(1)} MB</p></div>
                  <button type="button" disabled={Boolean(active) || !recoveryAvailable} onClick={() => void recover(batch.batchId, upload.uploadId)} className="rounded-lg bg-amber-300 px-4 py-2 text-sm font-black text-slate-950 disabled:opacity-50">{active === key ? "Recovering..." : "Recover stored ZIP"}</button>
                </div>;
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
