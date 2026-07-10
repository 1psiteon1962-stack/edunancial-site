import Link from "next/link";
import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Member Login | Edunancial",
};

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">

      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10">

        <div className="text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
            Member Login
          </p>

          <h1 className="mt-4 text-4xl font-bold">
            Welcome Back
          </h1>

        </div>

        <LoginForm />

        <div className="mt-10 flex justify-between">

          <Link
            href="/forgot-password"
            className="text-blue-400 hover:underline"
          >
            Forgot Password?
          </Link>

          <Link
            href="/register"
            className="text-blue-400 hover:underline"
          >
            Create Account
          </Link>

        </div>

      </div>

    </main>
  );
}
