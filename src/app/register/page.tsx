import Link from "next/link";

export const metadata = {
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

        <form className="mt-12 space-y-6">

          <div>

            <label className="mb-2 block font-semibold">
              First Name
            </label>

            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4"
              type="text"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Last Name
            </label>

            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4"
              type="text"
            />

          </div>

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
            Create Account
          </button>

        </form>

        <div className="mt-10 text-center">

          <Link
            href="/login"
            className="text-blue-400 underline"
          >
            Already have an account?
          </Link>

        </div>

      </div>

    </main>
  );
}
