"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCsrfToken, useSession } from "@/lib/auth/useSession";

type FieldErrors = Partial<Record<"email" | "password" | "form", string>>;

export default function LoginForm() {
  const router = useRouter();
  const { refresh } = useSession();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const email = emailRef.current?.value.trim() ?? "";
    const password = passwordRef.current?.value ?? "";

    const fieldErrors: FieldErrors = {};
    if (!email) fieldErrors.email = "Email is required.";
    if (!password) fieldErrors.password = "Password is required.";
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setPending(true);
    try {
      const csrfToken = getCsrfToken();
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as { success: boolean; error?: string };

      if (!res.ok || !data.success) {
        if (res.status === 429) {
          setErrors({ form: "Too many login attempts. Please try again later." });
        } else {
          setErrors({ form: data.error ?? "Login failed. Please try again." });
        }
        return;
      }

      await refresh();
      router.push("/dashboard");
    } catch {
      setErrors({ form: "A network error occurred. Please try again." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Sign in to your account"
      className="mt-12 space-y-6"
    >
      {errors.form && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-red-600 bg-red-950/40 px-5 py-4 text-sm text-red-400"
        >
          {errors.form}
        </div>
      )}

      <div>
        <label htmlFor="login-email" className="mb-2 block font-semibold">
          Email Address
        </label>
        <input
          ref={emailRef}
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <p id="login-email-error" role="alert" className="mt-2 text-sm text-red-400">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="login-password" className="mb-2 block font-semibold">
          Password
        </label>
        <input
          ref={passwordRef}
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-required="true"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "login-password-error" : undefined}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && (
          <p id="login-password-error" role="alert" className="mt-2 text-sm text-red-400">
            {errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="w-full rounded-xl bg-blue-600 py-4 text-lg font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing In…" : "Sign In"}
      </button>
    </form>
  );
}
