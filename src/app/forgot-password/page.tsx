import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | Edunancial",
};

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">

      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10">

        <h1 className="text-4xl font-bold">
          Reset Your Password
        </h1>

        <p className="mt-6 text-slate-300">
          Enter the email address associated with your membership account.
        </p>

        <ForgotPasswordForm />

      </div>

    </main>
  );
}
