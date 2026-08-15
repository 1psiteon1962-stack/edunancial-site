"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import SecurityCenterPanel from "@/components/security/SecurityCenterPanel";
import { useAuth } from "@/lib/authContext";
import { validatePassword } from "@/lib/auth/password";

export default function AccountSettingsClient() {
  const { user, loading, updatePassword } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("security");
  const [pwForm, setPwForm] = useState({ newPw: "", confirm: "" });
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">Loading…</p>
      </main>
    );
  }

  const passwordErrors = validatePassword(pwForm.newPw);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwSaved(false);
    if (passwordErrors.length > 0) { setPwError("New password does not meet requirements."); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError("New passwords do not match."); return; }
    setPwLoading(true);
    const result = await updatePassword(pwForm.newPw);
    setPwLoading(false);
    if (!result.success) {
      setPwError(result.error ?? "Unable to update password.");
      return;
    }
    setPwForm({ newPw: "", confirm: "" });
    setPwSaved(true);
  }

  const tabs = [
    { id: "security", label: "Security Center" },
    { id: "password", label: "Password" },
    { id: "language", label: "Language" },
  ];

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <nav className="mb-8 flex gap-2 text-sm text-slate-400">
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          <span>/</span>
          <span className="text-white">Account Settings</span>
        </nav>

        <h1 className="text-4xl font-black">Account Settings</h1>
        <p className="mt-2 text-slate-400">Signed in as <span className="text-white">{user.email}</span></p>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-700 pb-0">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`rounded-t-lg px-5 py-3 text-sm font-semibold transition ${activeTab === tab.id ? "border-b-2 border-blue-500 text-white" : "text-slate-400 hover:text-white"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {activeTab === "security" ? <SecurityCenterPanel /> : null}

          {activeTab === "password" ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
              <h2 className="text-2xl font-bold">Password</h2>
              <p className="mt-2 text-sm text-slate-400">Update your account password after opening the secure recovery session from your email or from your current authenticated session.</p>
              {pwSaved ? <div className="mt-4 rounded-lg border border-green-700 bg-green-950/40 px-4 py-3 text-sm text-green-300">✓ Password updated successfully.</div> : null}
              {pwError ? <div className="mt-4 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">{pwError}</div> : null}
              <form onSubmit={handlePasswordChange} className="mt-6 space-y-5">
                <div>
                  <label htmlFor="pw-new" className="mb-2 block text-sm font-semibold">New Password</label>
                  <input id="pw-new" type="password" value={pwForm.newPw} onChange={(e) => setPwForm((p) => ({ ...p, newPw: e.target.value }))} className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-blue-500 focus:outline-none" required />
                </div>
                <div>
                  <label htmlFor="pw-confirm" className="mb-2 block text-sm font-semibold">Confirm New Password</label>
                  <input id="pw-confirm" type="password" value={pwForm.confirm} onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))} className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-blue-500 focus:outline-none" required />
                </div>
                <button type="submit" disabled={pwLoading} className="rounded-xl bg-blue-600 px-8 py-3 font-bold hover:bg-blue-700 disabled:opacity-60">{pwLoading ? "Updating…" : "Update Password"}</button>
              </form>
            </div>
          ) : null}

          {activeTab === "language" ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
              <h2 className="text-2xl font-bold">Language & Region</h2>
              <p className="mt-2 text-sm text-slate-400">Use the global language selector in the header to change the site language consistently across pages.</p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
