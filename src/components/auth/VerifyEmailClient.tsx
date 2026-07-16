"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

type VerifyStatus = "pending" | "verifying" | "success" | "error" | "no_token";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<VerifyStatus>(token ? "verifying" : "no_token");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("no_token");
      return;
    }

    async function verify() {
      setStatus("verifying");
      try {
        const resp = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ token }),
        });
        const data = await resp.json();
        if (data.success) {
          setStatus("success");
          // Redirect to dashboard after a short delay
          setTimeout(() => router.push("/dashboard"), 2000);
        } else {
          setStatus("error");
          setErrorMessage(data.error ?? "Verification failed. Please request a new link.");
        }
      } catch {
        setStatus("error");
        setErrorMessage("Network error. Please try again.");
      }
    }

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <div
        className={[
          "rounded-2xl border p-10",
          status === "success"
            ? "border-green-700 bg-green-950/20"
            : status === "error"
            ? "border-red-700 bg-red-950/20"
            : "border-slate-700 bg-slate-900/60",
        ].join(" ")}
      >
        {status === "no_token" && (
          <>
            <h1 className="text-4xl font-bold">Verify Your Email</h1>
            <p className="mt-8 leading-8 text-slate-300">
              We've sent a verification email to the address you provided. Please click the
              verification link in that email to activate your account.
            </p>
            <p className="mt-4 text-sm text-slate-500">
              Didn't receive the email?{" "}
              <Link href="/account/resend-verification" className="text-blue-400 hover:underline">
                Resend verification email
              </Link>
            </p>
          </>
        )}

        {status === "verifying" && (
          <>
            <h1 className="text-4xl font-bold">Verifying…</h1>
            <p className="mt-6 text-slate-300">Please wait while we verify your email address.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-800/40 text-3xl">
              ✅
            </div>
            <h1 className="text-4xl font-bold">Email Verified!</h1>
            <p className="mt-6 text-slate-300">
              Your email address has been verified. Your account is now active.
            </p>
            <p className="mt-3 text-slate-400">Redirecting you to your dashboard…</p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-4xl font-bold">Verification Failed</h1>
            <p className="mt-6 text-red-300">{errorMessage}</p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/account/resend-verification"
                className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
              >
                Resend Verification
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-slate-700 px-6 py-3 font-bold hover:bg-slate-800"
              >
                Go to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
