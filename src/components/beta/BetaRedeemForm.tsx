"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/lib/authContext";

export const PENDING_BETA_CODE_KEY = "edunancial:pending-beta-code";

/** Not authoritative: only carries a typed code across signup/verification so the tester need not retype it. */
function readPending(): string {
  try { return window.sessionStorage.getItem(PENDING_BETA_CODE_KEY) ?? ""; } catch { return ""; }
}
function clearPending() {
  try { window.sessionStorage.removeItem(PENDING_BETA_CODE_KEY); } catch { /* ignore */ }
}

export default function BetaRedeemForm() {
  const { user, csrfToken } = useAuth();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { setCode((current) => current || readPending()); }, []);

  function rememberAndGo(path: string) {
    try { if (code.trim()) window.sessionStorage.setItem(PENDING_BETA_CODE_KEY, code.trim()); } catch { /* ignore */ }
    router.push(`${path}?next=${encodeURIComponent("/beta/redeem")}`);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(""); setSuccess("");
    if (!code.trim()) { setError("Enter your access code."); return; }
    if (!agree) { setError("Please accept the Beta Terms and Privacy Notice to continue."); return; }
    setLoading(true);
    const response = await fetch("/api/member/beta-redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken ?? "" },
      body: JSON.stringify({ code, acknowledgedTerms: true }),
    });
    const json = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) { setError(json.error ?? "That access code could not be redeemed."); return; }
    clearPending();
    setSuccess(json.message);
    setTimeout(() => { window.location.href = "/curriculum"; }, 1500);
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">Alpha / Beta Testers</p>
        <h1 className="mt-4 text-center text-3xl font-bold">Redeem your access code</h1>
        <p className="mt-3 text-center text-slate-400">90 days of full access to all eight tracks, Levels 1–5, and every published language. No credit card. No subscription. Nothing is charged when it ends.</p>

        {!user ? (
          <div className="mt-8 space-y-4">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="EDU-XXXX-XXXX-XXXX-XXXX" autoComplete="off" className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono uppercase" />
            <p className="text-sm text-slate-400">First create a free account (or sign in) and verify your email. Your code will be waiting here when you return.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <button onClick={() => rememberAndGo("/register")} className="rounded-xl bg-blue-600 py-3 font-bold">Create account</button>
              <button onClick={() => rememberAndGo("/login")} className="rounded-xl border border-slate-600 py-3 font-bold">Sign in</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
            {error && <div className="rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">{error}</div>}
            {success && <div className="rounded-lg border border-green-700 bg-green-950/40 px-4 py-3 text-sm text-green-300">{success}</div>}
            <p className="text-sm text-slate-400">Signed in as <span className="font-semibold text-slate-200">{user.email}</span></p>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="EDU-XXXX-XXXX-XXXX-XXXX" autoComplete="off" className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono uppercase" />
            <label className="flex items-start gap-3 text-sm text-slate-300">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5" />
              <span>I accept the <Link href="/beta-terms" className="text-blue-400 underline">Beta Terms</Link> and have read the <Link href="/privacy" className="text-blue-400 underline">Privacy Notice</Link>. Feedback is optional and does not require sharing income, balances, or debts.</span>
            </label>
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-yellow-500 py-3 font-bold text-slate-950 disabled:opacity-60">{loading ? "Activating…" : "Activate 90-day access"}</button>
          </form>
        )}
      </div>
    </main>
  );
}