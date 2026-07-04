import Link from "next/link";

export default function MemberLoginCTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10 text-center">

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Returning Member
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          Welcome Back
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Continue building your financial competency by accessing your
          personalized dashboard, courses, assessments, downloads,
          certificates, and AI coach.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-6">

          <Link
            href="/login"
            className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white"
          >
            Member Login
          </Link>

          <Link
            href="/register"
            className="rounded-xl border border-slate-500 px-8 py-4 font-semibold"
          >
            Create Account
          </Link>

        </div>

      </div>

    </section>
  );
}
