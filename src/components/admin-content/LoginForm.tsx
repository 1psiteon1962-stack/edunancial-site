"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Login failed.");
      setSubmitting(false);
      return;
    }
    router.push("/admin/content");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-12 grid max-w-md gap-4 rounded-3xl border border-white/10 bg-[#101a2f] p-8 shadow-2xl">
      <label className="grid gap-2 text-sm font-semibold text-slate-200">
        Admin email
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="rounded-xl border border-white/10 bg-[#08101f] px-4 py-3 text-white" />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-slate-200">
        Password
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required className="rounded-xl border border-white/10 bg-[#08101f] px-4 py-3 text-white" />
      </label>
      {error ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
      <button disabled={submitting} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-60">
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
