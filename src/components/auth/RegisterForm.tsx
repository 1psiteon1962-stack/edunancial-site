"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, validatePassword } from "@/lib/authContext";
import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

const COUNTRIES = [
  "United States",
  "Canada",
  "Mexico",
  "United Kingdom",
  "Australia",
  "Nigeria",
  "Ghana",
  "Jamaica",
  "Trinidad and Tobago",
  "Barbados",
  "Other",
];

/** Maps each password requirement to the English string validatePassword() returns and a translation key. */
const PASSWORD_REQUIREMENTS = [
  { en: "At least 12 characters", key: "auth.password.minLength" },
  { en: "At least one uppercase letter", key: "auth.password.uppercase" },
  { en: "At least one lowercase letter", key: "auth.password.lowercase" },
  { en: "At least one number", key: "auth.password.number" },
  { en: "At least one special character (!@#$%^&*)", key: "auth.password.special" },
] as const;

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const { t } = useInternationalPreferences();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    agree: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordErrors = validatePassword(form.password);
  const passwordStrong = form.password.length > 0 && passwordErrors.length === 0;

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.country) {
      setError(t("auth.errors.required"));
      return;
    }
    if (passwordErrors.length > 0) {
      setError(t("auth.errors.passwordWeak"));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t("auth.errors.passwordMismatch"));
      return;
    }
    if (!form.agree) {
      setError(t("auth.errors.mustAgree"));
      return;
    }
    setLoading(true);
    const result = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      country: form.country,
    });
    setLoading(false);
    if (result.success) {
      router.push("/verify-email");
    } else {
      setError(result.error ?? t("auth.errors.registrationFailed"));
    }
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
            {t("auth.register.label")}
          </p>
          <h1 className="mt-4 text-4xl font-bold">{t("auth.register.heading")}</h1>
          <p className="mt-3 text-slate-400">
            {t("auth.register.subheading")}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {t("auth.register.betaNote")}
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="reg-first" className="mb-2 block text-sm font-semibold">
                {t("auth.register.firstNameLabel")} <span className="text-red-400">*</span>
              </label>
              <input
                id="reg-first"
                type="text"
                autoComplete="given-name"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                placeholder={t("auth.register.firstNamePlaceholder")}
                required
              />
            </div>
            <div>
              <label htmlFor="reg-last" className="mb-2 block text-sm font-semibold">
                {t("auth.register.lastNameLabel")} <span className="text-red-400">*</span>
              </label>
              <input
                id="reg-last"
                type="text"
                autoComplete="family-name"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                placeholder={t("auth.register.lastNamePlaceholder")}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" className="mb-2 block text-sm font-semibold">
              {t("auth.register.emailLabel")} <span className="text-red-400">*</span>
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              placeholder={t("auth.register.emailPlaceholder")}
              required
            />
          </div>

          <div>
            <label htmlFor="reg-country" className="mb-2 block text-sm font-semibold">
              {t("auth.register.countryLabel")} <span className="text-red-400">*</span>
            </label>
            <select
              id="reg-country"
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">{t("auth.register.countryPlaceholder")}</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="reg-password" className="mb-2 block text-sm font-semibold">
              {t("auth.register.passwordLabel")} <span className="text-red-400">*</span>
            </label>
            <input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              className={`w-full rounded-lg border p-3 text-white placeholder-slate-500 focus:outline-none bg-slate-950 ${
                form.password.length === 0
                  ? "border-slate-700"
                  : passwordStrong
                  ? "border-green-600"
                  : "border-yellow-600"
              } focus:border-blue-500`}
              placeholder="Create a strong password"
              required
            />
            {form.password.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs">
                {PASSWORD_REQUIREMENTS.map((req) => {
                  const met = !passwordErrors.includes(req.en);
                  return (
                    <li key={req.key} className={met ? "text-green-400" : "text-slate-400"}>
                      {met ? "✓" : "○"} {t(req.key)}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div>
            <label htmlFor="reg-confirm" className="mb-2 block text-sm font-semibold">
              {t("auth.register.confirmPasswordLabel")} <span className="text-red-400">*</span>
            </label>
            <input
              id="reg-confirm"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => set("confirmPassword", e.target.value)}
              className={`w-full rounded-lg border p-3 text-white placeholder-slate-500 focus:outline-none bg-slate-950 ${
                form.confirmPassword.length === 0
                  ? "border-slate-700"
                  : form.password === form.confirmPassword
                  ? "border-green-600"
                  : "border-red-600"
              } focus:border-blue-500`}
              placeholder="Repeat your password"
              required
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) => set("agree", e.target.checked)}
              className="mt-0.5 shrink-0"
            />
            <span>
              {t("auth.register.agreeLabel")}{" "}
              <Link href="/terms" className="text-blue-400 underline">
                {t("auth.register.termsLink")}
              </Link>{" "}
              {t("auth.register.and")}{" "}
              <Link href="/privacy" className="text-blue-400 underline">
                {t("auth.register.privacyLink")}
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-base font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "…" : t("auth.register.submit")}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-400">{t("auth.register.haveAccount")}</span>{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            {t("auth.register.signIn")}
          </Link>
        </div>
      </div>
    </main>
  );
}
