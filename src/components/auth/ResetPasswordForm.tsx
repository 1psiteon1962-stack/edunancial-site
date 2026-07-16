"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { validatePassword } from "@/lib/authContext";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const policyErrors = validatePassword(password);
  const passwordStrong = password.length > 0 && policyErrors.length === 0;

  if (!token) {
    return (
      <main className="mx-auto max-w-md px-6 py-20">
        <div className="rounded-2xl border border-red-700 bg-red-950/20 p-10">
          <h1 className="text-3xl font-bold">Invalid Reset Link</h1>
          <p className="mt-4 text-slate-300">
            This password reset link is missing a token. Please request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Request New Link
          </Link>
        </div>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (policyErrors.length > 0) {
      setError("Password does not meet security requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, password }),
      });
      const data = await resp.json();

      if (data.success) {
        router.push("/login?reset=1");
      } else {
        setError(data.error ?? "Password reset failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10">
        <h1 className="text-4xl font-bold">Set New Password</h1>
        <p className="mt-4 text-slate-400">
          Enter your new password below. You will be redirected to sign in once it's saved.
        </p>

        {error && (
          <div className="mt-6 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="new-password" className="mb-2 block text-sm font-semibold">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              placeholder="••••••••••••"
              required
            />
            {password.length > 0 && policyErrors.length > 0 && (
              <ul className="mt-2 space-y-1">
                {policyErrors.map((e) => (
                  <li key={e} className="text-xs text-red-400">
                    ✗ {e}
                  </li>
                ))}
              </ul>
            )}
            {passwordStrong && (
              <p className="mt-2 text-xs text-green-400">✓ Password meets requirements</p>
            )}
          </div>

          <div>
            <label htmlFor="confirm-password" className="mb-2 block text-sm font-semibold">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              placeholder="••••••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !passwordStrong}
            className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Set New Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
