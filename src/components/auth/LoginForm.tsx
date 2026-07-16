"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const { t } = useInternationalPreferences();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [betaPassNumber, setBetaPassNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError(t("auth.errors.required"));
      return;
    }
    setLoading(true);
    const result = await login(email, password, betaPassNumber || undefined);
    setLoading(false);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error ?? t("auth.errors.loginFailed"));
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
            {t("auth.login.label")}
          </p>
          <h1 className="mt-4 text-4xl font-bold">{t("auth.login.heading")}</h1>
          <p className="mt-3 text-slate-400">
            {t("auth.login.subheading")}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {t("auth.login.betaNote")}
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
              {t("auth.login.emailLabel")}
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              placeholder={t("auth.login.emailPlaceholder")}
              required
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-2 block text-sm font-semibold">
              {t("auth.login.passwordLabel")}
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

          <div>
            <label htmlFor="login-beta-pass-number" className="mb-2 block text-sm font-semibold">
              {t("auth.login.betaPassLabel")}
            </label>
            <input
              id="login-beta-pass-number"
              type="text"
              value={betaPassNumber}
              onChange={(e) => setBetaPassNumber(e.target.value.toUpperCase())}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              placeholder={t("auth.login.betaPassPlaceholder")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-base font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "…" : t("auth.login.submit")}
          </button>
        </form>

        <div className="mt-8 flex justify-between text-sm">
          <Link href="/forgot-password" className="text-blue-400 hover:underline">
            {t("auth.login.forgotPassword")}
          </Link>
          <Link href="/register" className="text-blue-400 hover:underline">
            {t("auth.login.createAccount")}
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        {t("auth.login.noAccount")}{" "}
        <Link href="/register" className="underline">
          {t("auth.login.createAccount")}
        </Link>
      </p>
    </main>
  );
}

