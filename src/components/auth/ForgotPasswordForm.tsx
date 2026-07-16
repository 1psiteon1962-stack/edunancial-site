"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await resp.json();
      if (!resp.ok && !data.success) {
        setError(data.error ?? "Failed to send reset email. Please try again.");
        setLoading(false);
        return;
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
      return;
    }
    setLoading(false);
    setSent(true);
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10">
        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-800/40 text-3xl">
              ✉️
            </div>
            <h1 className="text-3xl font-bold">Check Your Email</h1>
            <p className="mt-4 text-slate-300">
              If an account with{" "}
              <span className="font-semibold text-white">{email}</span> exists,
              we've sent a password reset link.
            </p>
            <p className="mt-4 text-sm text-slate-400">
              Check your spam folder if you don't see the email within a few
              minutes.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-bold hover:bg-blue-700"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold">Reset Your Password</h1>
            <p className="mt-4 text-slate-300">
              Enter the email address associated with your membership account and
              we'll send you a reset link.
            </p>

            {error && (
              <div className="mt-5 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
              <div>
                <label
                  htmlFor="reset-email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email Address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <Link href="/login" className="text-blue-400 hover:underline">
                Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
