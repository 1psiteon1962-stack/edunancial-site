"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/authContext";
import { validatePassword } from "@/lib/auth/password";

export default function ResetPasswordForm() {
  const { updatePassword } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordErrors = validatePassword(password);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(". "));
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? "Unable to update password.");
      return;
    }

    router.push("/login?reset=success");
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10">
        <h1 className="text-4xl font-bold">Set a new password</h1>
        <p className="mt-4 text-slate-300">Choose a strong password for your member account.</p>
        {error ? <div className="mt-6 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">{error}</div> : null}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="new-password" className="mb-2 block text-sm font-semibold">New Password</label>
            <input id="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-2 block text-sm font-semibold">Confirm Password</label>
            <input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-blue-500 focus:outline-none" />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-60">{loading ? "Updating…" : "Update Password"}</button>
        </form>
        <div className="mt-6 text-center text-sm"><Link href="/login" className="text-blue-400 hover:underline">Back to Sign In</Link></div>
      </div>
    </main>
  );
}
