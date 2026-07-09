"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error ?? "Login failed.");
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
            Member Login
          </p>
          <h1 className="mt-4 text-4xl font-bold">Welcome Back</h1>
          <p className="mt-3 text-slate-400">
            Sign in to access your Financial Competency Dashboard.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm font-semibold">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-2 block text-sm font-semibold">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              placeholder="••••••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-base font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-8 flex justify-between text-sm">
          <Link href="/forgot-password" className="text-blue-400 hover:underline">
            Forgot Password?
          </Link>
          <Link href="/register" className="text-blue-400 hover:underline">
            Create Account
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        By signing in you agree to our{" "}
        <Link href="/terms" className="underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </main>
  );
}
