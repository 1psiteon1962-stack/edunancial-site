"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/lib/authContext";

interface SecurityCenterPayload {
  security: {
    email: string;
    emailVerified: boolean;
    pinEnabled: boolean;
    pinLockedUntil: string | null;
    pinChangedAt: string | null;
    failedPinAttempts: number;
    lastSignInAt: string | null;
    events: Array<{
      id: string;
      eventType: string;
      outcome: string;
      createdAt: string;
      metadata: Record<string, unknown>;
    }>;
    mfa: {
      totpSupported: boolean;
      passkeysSupported: boolean;
      configurationRequired: string[];
    };
  };
}

export default function SecurityCenterPanel() {
  const { csrfToken, requestPasswordReset, signOutOtherSessions, logout } = useAuth();
  const [data, setData] = useState<SecurityCenterPayload["security"] | null>(null);
  const [pin, setPin] = useState("");
  const [verifyPin, setVerifyPin] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      const response = await fetch("/api/member/security-center", { cache: "no-store" });
      const payload = (await response.json().catch(() => ({}))) as Partial<SecurityCenterPayload>;
      if (!active) {
        return;
      }
      setData(payload.security ?? null);
      setLoading(false);
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  async function savePin() {
    if (!csrfToken) return;
    const response = await fetch("/api/member/security/pin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({ pin }),
    });
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    setMessage(response.ok ? "Security PIN saved." : payload.error ?? "Unable to save PIN.");
    if (response.ok) {
      setPin("");
      setLoading(true);
      const refreshed = await fetch("/api/member/security-center", { cache: "no-store" });
      const refreshedPayload = (await refreshed.json()) as SecurityCenterPayload;
      setData(refreshedPayload.security);
      setLoading(false);
    }
  }

  async function submitPinVerification() {
    if (!csrfToken) return;
    const response = await fetch("/api/member/security/pin/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({ pin: verifyPin }),
    });
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    setMessage(response.ok ? "Security PIN verified." : payload.error ?? "Unable to verify PIN.");
    setVerifyPin("");
  }

  async function sendPasswordReset() {
    if (!data) return;
    const result = await requestPasswordReset(data.email);
    setMessage(result.success ? "Password reset email sent if the account exists." : result.error ?? "Unable to send password reset email.");
  }

  async function endOtherSessions() {
    const result = await signOutOtherSessions();
    setMessage(result.success ? "Other sessions signed out." : result.error ?? "Unable to sign out other sessions.");
  }

  if (loading || !data) {
    return <p className="text-sm text-slate-400">Loading security center…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-6">
        <h3 className="text-xl font-bold">Security Center</h3>
        <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
          <p><span className="font-semibold text-white">Account email:</span> {data.email}</p>
          <p><span className="font-semibold text-white">Email verified:</span> {data.emailVerified ? "Yes" : "No"}</p>
          <p><span className="font-semibold text-white">Security PIN:</span> {data.pinEnabled ? "Enabled" : "Disabled"}</p>
          <p><span className="font-semibold text-white">Last sign in:</span> {data.lastSignInAt ? new Date(data.lastSignInAt).toLocaleString() : "Unavailable"}</p>
        </div>
        {data.pinLockedUntil ? (
          <p className="mt-3 text-sm text-yellow-300">PIN locked until {new Date(data.pinLockedUntil).toLocaleString()}.</p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-6">
        <h4 className="text-lg font-bold">Set or change security PIN</h4>
        <p className="mt-2 text-sm text-slate-400">Use a non-sequential six-digit PIN. Sign in again if you have been idle too long.</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input value={pin} onChange={(event) => setPin(event.target.value)} inputMode="numeric" maxLength={6} className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Enter 6-digit PIN" />
          <button type="button" onClick={savePin} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold hover:bg-blue-500">Save PIN</button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-6">
        <h4 className="text-lg font-bold">Verify security PIN</h4>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input value={verifyPin} onChange={(event) => setVerifyPin(event.target.value)} inputMode="numeric" maxLength={6} className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Enter PIN to verify" />
          <button type="button" onClick={submitPinVerification} className="rounded-xl border border-slate-600 px-5 py-3 text-sm font-bold text-slate-200 hover:bg-slate-800">Verify PIN</button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-6">
        <h4 className="text-lg font-bold">Password and sessions</h4>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={sendPasswordReset} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold hover:bg-blue-500">Send password reset email</button>
          <button type="button" onClick={endOtherSessions} className="rounded-xl border border-slate-600 px-5 py-3 text-sm font-bold text-slate-200 hover:bg-slate-800">Sign out other sessions</button>
          <button type="button" onClick={() => void logout()} className="rounded-xl border border-red-700 px-5 py-3 text-sm font-bold text-red-300 hover:bg-red-900/30">Sign out</button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-6">
        <h4 className="text-lg font-bold">Recent security events</h4>
        <div className="mt-4 space-y-3">
          {data.events.length === 0 ? <p className="text-sm text-slate-400">No recent security events.</p> : data.events.map((event) => (
            <div key={event.id} className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-white">{event.eventType}</span>
                <span className="text-xs uppercase tracking-wide text-slate-400">{event.outcome}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{new Date(event.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-6">
        <h4 className="text-lg font-bold">MFA and passkeys</h4>
        <p className="mt-2 text-sm text-slate-400">Extension points are ready. Complete the remaining Supabase console configuration before exposing TOTP MFA enrollment or passkey support.</p>
      </div>

      {message ? <p className="text-sm text-slate-300">{message}</p> : null}
    </div>
  );
}
