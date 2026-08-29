"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Upload = { uploadId: string; originalFilename: string; sizeBytes: number; storagePath: string };
type RecoverableBatch = { batchId: string; uploads: Upload[] };

export default function RecoveryClient() {
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState("");
  const [batches, setBatches] = useState<RecoverableBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [sessionResponse, recoveryResponse] = await Promise.all([
        fetch("/api/admin/auth/session", { cache: "no-store" }),
        fetch("/api/admin/content/upload/recover", { cache: "no-store" }),
      ]);
      const session = await sessionResponse.json();
      const recovery = await recoveryResponse.json();
      if (!recoveryResponse.ok) throw new Error(recovery.error ?? "Unable to inspect interrupted uploads.");
      setCsrfToken(session.csrfToken ?? "");
      setBatches(recovery.recoverable ?? []);
    } catch (err) {
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
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? "Recovery failed.");
    return payload;
  }

  async function recover(batchId: string, uploadId: string) {
    const key = `${batchId}:${uploadId}`;
    setActive(key);
    setError("");
    setProgress("");
    try {
      const payload = await recoverRequest(batchId, uploadId);
      router.push(`/admin/content/batches/${payload.batch.id}`);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      await load();
    } finally {
      setActive(null);
    }
  }

  async function recoverAll() {
    const queue = batches.flatMap((batch) => batch.uploads.map((upload) => ({ batchId: batch.batchId, upload })));
    if (!queue.length) return;
    setActive("all");
    setError("");
    let recovered = 0;
    try {
      for (const item of queue) {
        setProgress(`Recovering ${recovered + 1} of ${queue.length}: ${item.upload.originalFilename}`);
        await recoverRequest(item.batchId, item.upload.uploadId);
        recovered += 1;
      }
      setProgress(`Recovered ${recovered} stored package${recovered === 1 ? "" : "s"} into draft review.`);
      await load();
      router.refresh();
    } catch (err) {
      setError(`${(err as Error).message} ${recovered} of ${queue.length} packages were recovered before the error.`);
      await load();
    } finally {
      setActive(null);
    }
  }

  const totalUploads = batches.reduce((sum, batch) => sum + batch.uploads.length, 0);

  if (loading) return <p className="text-sm text-slate-400">Checking for interrupted stored uploads...</p>;

  return (
    <section className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-amber-100">Recover interrupted uploads</h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-300">These files already reached storage but did not record a successful finalization. Recovery processes stored packages sequentially into draft review without uploading them again.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {totalUploads > 0 ? <button type="button" disabled={Boolean(active)} onClick={() => void recoverAll()} className="rounded-lg bg-emerald-300 px-4 py-2 text-sm font-black text-slate-950 disabled:opacity-50">{active === "all" ? "Recovering all..." : `Recover all ${totalUploads} stored ZIP${totalUploads === 1 ? "" : "s"}`}</button> : null}
          <button type="button" disabled={Boolean(active)} onClick={() => void load()} className="rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold disabled:opacity-50">Refresh</button>
        </div>
      </div>
      {progress ? <p className="mt-4 rounded-lg bg-slate-950/40 p-3 text-sm text-slate-200">{progress}</p> : null}
      {error ? <p className="mt-4 rounded-lg bg-red-950/50 p-3 text-sm text-red-200">{error}</p> : null}
      {!batches.length ? <p className="mt-4 text-sm text-emerald-200">No interrupted stored uploads currently need recovery.</p> : null}
      <div className="mt-4 space-y-4">
        {batches.map((batch) => (
          <div key={batch.batchId} className="rounded-xl border border-white/10 bg-[#0b1426] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Original batch {batch.batchId}</p>
            <div className="mt-3 space-y-2">
              {batch.uploads.map((upload) => {
                const key = `${batch.batchId}:${upload.uploadId}`;
                return <div key={upload.uploadId} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white/5 p-3">
                  <div><p className="font-semibold text-white">{upload.originalFilename}</p><p className="text-xs text-slate-400">{(upload.sizeBytes / 1024 / 1024).toFixed(1)} MB</p></div>
                  <button type="button" disabled={Boolean(active)} onClick={() => void recover(batch.batchId, upload.uploadId)} className="rounded-lg bg-amber-300 px-4 py-2 text-sm font-black text-slate-950 disabled:opacity-50">{active === key ? "Recovering..." : "Recover stored ZIP"}</button>
                </div>;
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
