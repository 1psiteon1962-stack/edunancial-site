"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCsrfToken } from "@/lib/auth/useSession";

type FieldErrors = Partial<
  Record<"firstName" | "lastName" | "email" | "password" | "form", string>
>;

export default function RegisterForm() {
  const router = useRouter();

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const firstName = firstNameRef.current?.value.trim() ?? "";
    const lastName = lastNameRef.current?.value.trim() ?? "";
    const email = emailRef.current?.value.trim() ?? "";
    const password = passwordRef.current?.value ?? "";

    const fieldErrors: FieldErrors = {};
    if (!firstName) fieldErrors.firstName = "First name is required.";
    if (!lastName) fieldErrors.lastName = "Last name is required.";
    if (!email) fieldErrors.email = "Email is required.";
    if (!password) fieldErrors.password = "Password is required.";
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setPending(true);
    try {
      // Fetch a fresh CSRF token before the first submission.
      let csrfToken = getCsrfToken();
      if (!csrfToken) {
        const csrfRes = await fetch("/api/auth/csrf", { credentials: "include" });
        if (csrfRes.ok) {
          const csrfData = (await csrfRes.json()) as { csrfToken?: string };
          csrfToken = csrfData.csrfToken ?? "";
        }
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = (await res.json()) as { success: boolean; error?: string };

      if (!res.ok || !data.success) {
        if (res.status === 429) {
          setErrors({ form: "Too many registration attempts. Please try again later." });
        } else {
          setErrors({ form: data.error ?? "Registration failed. Please try again." });
        }
        return;
      }

      router.push("/verify-email");
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
      aria-label="Create your Edunancial account"
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
        <label htmlFor="reg-first-name" className="mb-2 block font-semibold">
          First Name
        </label>
        <input
          ref={firstNameRef}
          id="reg-first-name"
          name="firstName"
          type="text"
          autoComplete="given-name"
          required
          aria-required="true"
          aria-invalid={!!errors.firstName}
          aria-describedby={errors.firstName ? "reg-first-name-error" : undefined}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.firstName && (
          <p id="reg-first-name-error" role="alert" className="mt-2 text-sm text-red-400">
            {errors.firstName}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="reg-last-name" className="mb-2 block font-semibold">
          Last Name
        </label>
        <input
          ref={lastNameRef}
          id="reg-last-name"
          name="lastName"
          type="text"
          autoComplete="family-name"
          required
          aria-required="true"
          aria-invalid={!!errors.lastName}
          aria-describedby={errors.lastName ? "reg-last-name-error" : undefined}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.lastName && (
          <p id="reg-last-name-error" role="alert" className="mt-2 text-sm text-red-400">
            {errors.lastName}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="reg-email" className="mb-2 block font-semibold">
          Email Address
        </label>
        <input
          ref={emailRef}
          id="reg-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "reg-email-error" : undefined}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <p id="reg-email-error" role="alert" className="mt-2 text-sm text-red-400">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="reg-password" className="mb-2 block font-semibold">
          Password
        </label>
        <input
          ref={passwordRef}
          id="reg-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          aria-required="true"
          aria-invalid={!!errors.password}
          aria-describedby="reg-password-hint reg-password-error"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p id="reg-password-hint" className="mt-2 text-xs text-slate-400">
          Minimum 12 characters with uppercase, lowercase, number, and special character.
        </p>
        {errors.password && (
          <p id="reg-password-error" role="alert" className="mt-1 text-sm text-red-400">
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
        {pending ? "Creating Account…" : "Create Account"}
      </button>
    </form>
  );
}
