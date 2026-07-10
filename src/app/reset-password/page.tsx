import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | Edunancial",
};

export default function ResetPasswordPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">

      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10">

        <h1 className="text-4xl font-bold">
          Set a New Password
        </h1>

        <p className="mt-6 text-slate-300">
          Choose a strong password for your Edunancial account.
        </p>

        <Suspense fallback={<div className="mt-10 text-slate-400">Loading…</div>}>
          <ResetPasswordForm />
        </Suspense>

        <div className="mt-10 text-center">
          <Link href="/login" className="text-blue-400 hover:underline">
            Back to Sign In
          </Link>
        </div>

      </div>

    </main>
  );
}
