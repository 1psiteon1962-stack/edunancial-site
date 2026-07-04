import Link from "next/link";

export const metadata = {
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

        <form className="mt-12 space-y-6">

          <div>

            <label className="mb-2 block font-semibold">
              Email Address
            </label>

            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4"
              type="email"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Password
            </label>

            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4"
              type="password"
            />

          </div>

          <button
            className="w-full rounded-xl bg-blue-600 py-4 text-lg font-bold text-white"
            type="submit"
          >
            Sign In
          </button>

        </form>

        <div className="mt-10 flex justify-between">

          <Link
            href="/forgot-password"
            className="text-blue-400"
          >
            Forgot Password?
          </Link>

          <Link
            href="/register"
            className="text-blue-400"
          >
            Create Account
          </Link>

        </div>

      </div>

    </main>
  );
}
