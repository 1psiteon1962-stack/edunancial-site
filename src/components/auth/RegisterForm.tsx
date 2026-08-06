"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { useAuth, validatePassword } from "@/lib/authContext";

const COUNTRIES = [
  { value: "United States", labelKey: "register.country.unitedStates" },
  { value: "Canada", labelKey: "register.country.canada" },
  { value: "Mexico", labelKey: "register.country.mexico" },
  { value: "United Kingdom", labelKey: "register.country.unitedKingdom" },
  { value: "Australia", labelKey: "register.country.australia" },
  { value: "Nigeria", labelKey: "register.country.nigeria" },
  { value: "Ghana", labelKey: "register.country.ghana" },
  { value: "Jamaica", labelKey: "register.country.jamaica" },
  { value: "Trinidad and Tobago", labelKey: "register.country.trinidadAndTobago" },
  { value: "Barbados", labelKey: "register.country.barbados" },
  { value: "Other", labelKey: "register.country.other" },
];

export default function RegisterForm() {
  const { register } = useAuth();
  const { t } = useInternationalPreferences();
  const router = useRouter();

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
  const passwordRules = [
    {
      id: `At least 12 characters`,
      label: t("register.passwordRule.length"),
    },
    {
      id: "At least one uppercase letter",
      label: t("register.passwordRule.uppercase"),
    },
    {
      id: "At least one lowercase letter",
      label: t("register.passwordRule.lowercase"),
    },
    {
      id: "At least one number",
      label: t("register.passwordRule.number"),
    },
    {
      id: "At least one special character (!@#$%^&*)",
      label: t("register.passwordRule.special"),
    },
  ];

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.country) {
      setError(t("register.error.required"));
      return;
    }
    if (passwordErrors.length > 0) {
      setError(t("register.error.passwordRequirements"));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t("register.error.passwordMismatch"));
      return;
    }
    if (!form.agree) {
      setError(t("register.error.agree"));
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
      setError(result.error ?? t("register.error.failed"));
    }
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
            {t("register.label")}
          </p>
          <h1 className="mt-4 text-4xl font-bold">{t("register.title")}</h1>
          <p className="mt-3 text-slate-400">
            {t("register.subtitle")}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {t("register.betaNote")}
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
                {t("register.firstNameLabel")} <span className="text-red-400">*</span>
              </label>
              <input
                id="reg-first"
                type="text"
                autoComplete="given-name"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                placeholder={t("register.firstNamePlaceholder")}
                required
              />
            </div>
            <div>
              <label htmlFor="reg-last" className="mb-2 block text-sm font-semibold">
                {t("register.lastNameLabel")} <span className="text-red-400">*</span>
              </label>
              <input
                id="reg-last"
                type="text"
                autoComplete="family-name"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                placeholder={t("register.lastNamePlaceholder")}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" className="mb-2 block text-sm font-semibold">
              {t("register.emailLabel")} <span className="text-red-400">*</span>
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              placeholder={t("register.emailPlaceholder")}
              required
            />
          </div>

          <div>
            <label htmlFor="reg-country" className="mb-2 block text-sm font-semibold">
              {t("register.countryLabel")} <span className="text-red-400">*</span>
            </label>
            <select
              id="reg-country"
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">{t("register.countryPlaceholder")}</option>
              {COUNTRIES.map((country) => (
                <option key={country.value} value={country.value}>{t(country.labelKey)}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="reg-password" className="mb-2 block text-sm font-semibold">
              {t("register.passwordLabel")} <span className="text-red-400">*</span>
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
              placeholder={t("register.passwordPlaceholder")}
              required
            />
            {form.password.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs">
                {passwordRules.map((rule) => {
                  const met = !passwordErrors.includes(rule.id);
                  return (
                    <li key={rule.id} className={met ? "text-green-400" : "text-slate-400"}>
                      {met ? "✓" : "○"} {rule.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div>
            <label htmlFor="reg-confirm" className="mb-2 block text-sm font-semibold">
              {t("register.confirmPasswordLabel")} <span className="text-red-400">*</span>
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
              placeholder={t("register.confirmPasswordPlaceholder")}
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
              {t("register.agreePrefix")}{" "}
              <Link href="/terms" className="text-blue-400 underline">
                {t("register.termsLabel")}
              </Link>{" "}
              {t("register.agreeAnd")}{" "}
              <Link href="/privacy" className="text-blue-400 underline">
                {t("register.privacyLabel")}
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-base font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? t("register.creating") : t("register.createAccount")}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-blue-400 hover:underline">
            {t("register.loginLink")}
          </Link>
        </div>
      </div>
    </main>
  );
}
