import Link from "next/link";
import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Your Account | Edunancial",
  description: "Register for your Edunancial membership.",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">

      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10">

        <div className="text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
            Membership Registration
          </p>

          <h1 className="mt-4 text-4xl font-bold">
            Create Your Account
          </h1>

          <p className="mt-6 text-slate-300">
            Begin building your Financial Competency today.
          </p>

        </div>

        <RegisterForm />

        <div className="mt-10 text-center">

          <Link
            href="/login"
            className="text-blue-400 underline hover:text-blue-300"
          >
            Already have an account?
          </Link>

        </div>

      </div>

    </main>
  );
}
