"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type FieldErrors = Partial<Record<"password" | "confirm" | "form", string>>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const password = passwordRef.current?.value ?? "";
    const confirm = confirmRef.current?.value ?? "";

    const fieldErrors: FieldErrors = {};
    if (!password) fieldErrors.password = "New password is required.";
    if (!confirm) fieldErrors.confirm = "Please confirm your password.";
    if (password && confirm && password !== confirm) {
      fieldErrors.confirm = "Passwords do not match.";
    }
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    if (!token) {
      setErrors({ form: "Missing reset token. Please request a new reset link." });
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = (await res.json()) as { success: boolean; error?: string };

      if (!res.ok || !data.success) {
        setErrors({ form: data.error ?? "Password reset failed. Please try again." });
        return;
      }

      router.push("/login?reset=1");
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
      aria-label="Set a new password"
      className="mt-10 space-y-6"
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
        <label htmlFor="reset-password" className="mb-2 block font-semibold">
          New Password
        </label>
        <input
          ref={passwordRef}
          id="reset-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          aria-required="true"
          aria-invalid={!!errors.password}
          aria-describedby="reset-password-hint reset-password-error"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p id="reset-password-hint" className="mt-2 text-xs text-slate-400">
          Minimum 12 characters with uppercase, lowercase, number, and special character.
        </p>
        {errors.password && (
          <p id="reset-password-error" role="alert" className="mt-1 text-sm text-red-400">
            {errors.password}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="reset-confirm" className="mb-2 block font-semibold">
          Confirm New Password
        </label>
        <input
          ref={confirmRef}
          id="reset-confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          aria-required="true"
          aria-invalid={!!errors.confirm}
          aria-describedby={errors.confirm ? "reset-confirm-error" : undefined}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.confirm && (
          <p id="reset-confirm-error" role="alert" className="mt-2 text-sm text-red-400">
            {errors.confirm}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Resetting Password…" : "Set New Password"}
      </button>
    </form>
  );
}
