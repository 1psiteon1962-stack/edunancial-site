"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ExecutiveLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/executive/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        return;
      }
      router.push("/executive/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-md space-y-5">
      {error && (
        <div role="alert" className="rounded-lg bg-red-900/50 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="exec-email" className="mb-1 block text-sm font-semibold text-slate-300">
          Email
        </label>
        <input
          id="exec-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="owner@edunancial.com"
        />
      </div>
      <div>
        <label htmlFor="exec-password" className="mb-1 block text-sm font-semibold text-slate-300">
          Password
        </label>
        <input
          id="exec-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-yellow-500 px-6 py-3 font-bold text-slate-900 transition hover:bg-yellow-400 disabled:opacity-60"
      >
        {loading ? "Authenticating…" : "Access Executive Dashboard"}
      </button>
    </form>
  );
}
