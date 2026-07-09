"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, validatePassword } from "@/lib/authContext";

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

export default function RegisterForm() {
  const { register } = useAuth();
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

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.country) {
      setError("Please complete all required fields.");
      return;
    }
    if (passwordErrors.length > 0) {
      setError("Password does not meet security requirements.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.agree) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
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
      setError(result.error ?? "Registration failed.");
    }
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
            Membership Registration
          </p>
          <h1 className="mt-4 text-4xl font-bold">Create Your Account</h1>
          <p className="mt-3 text-slate-400">
            Begin building your Financial Competency today.
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
                First Name <span className="text-red-400">*</span>
              </label>
              <input
                id="reg-first"
                type="text"
                autoComplete="given-name"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                placeholder="First name"
                required
              />
            </div>
            <div>
              <label htmlFor="reg-last" className="mb-2 block text-sm font-semibold">
                Last Name <span className="text-red-400">*</span>
              </label>
              <input
                id="reg-last"
                type="text"
                autoComplete="family-name"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                placeholder="Last name"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" className="mb-2 block text-sm font-semibold">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="reg-country" className="mb-2 block text-sm font-semibold">
              Country <span className="text-red-400">*</span>
            </label>
            <select
              id="reg-country"
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">Select your country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="reg-password" className="mb-2 block text-sm font-semibold">
              Password <span className="text-red-400">*</span>
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
                {[
                  "At least 12 characters",
                  "At least one uppercase letter",
                  "At least one lowercase letter",
                  "At least one number",
                  "At least one special character (!@#$%^&*)",
                ].map((req) => {
                  const met = !passwordErrors.includes(req);
                  return (
                    <li key={req} className={met ? "text-green-400" : "text-slate-400"}>
                      {met ? "✓" : "○"} {req}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div>
            <label htmlFor="reg-confirm" className="mb-2 block text-sm font-semibold">
              Confirm Password <span className="text-red-400">*</span>
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
              I agree to the{" "}
              <Link href="/terms" className="text-blue-400 underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-400 underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-base font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-blue-400 hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
