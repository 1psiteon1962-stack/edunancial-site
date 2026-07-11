"use client";

import { useState, useRef } from "react";

type State =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };

export default function ForgotPasswordForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<State>({ status: "idle" });
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ status: "idle" });

    const email = emailRef.current?.value.trim() ?? "";
    if (!email) {
      setState({ status: "error", message: "Email is required." });
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.status === 429) {
        setState({ status: "error", message: "Too many requests. Please try again later." });
        return;
      }

      // Always show success to avoid user enumeration.
      setState({ status: "success" });
    } catch {
      setState({ status: "error", message: "A network error occurred. Please try again." });
    } finally {
      setPending(false);
    }
  }

  if (state.status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mt-10 rounded-lg border border-green-700 bg-green-950/30 px-6 py-5 text-sm text-green-300"
      >
        If that email is registered, you will receive a password reset link shortly.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Request a password reset"
      className="mt-10 space-y-6"
    >
      {state.status === "error" && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-red-600 bg-red-950/40 px-5 py-4 text-sm text-red-400"
        >
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="forgot-email" className="mb-2 block font-semibold">
          Email Address
        </label>
        <input
          ref={emailRef}
          id="forgot-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          placeholder="you@example.com"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send Reset Link"}
      </button>
    </form>
  );
}
