import Link from "next/link";

export default function DashboardHero() {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 p-12">

      <p className="text-yellow-400 font-bold uppercase tracking-[0.4em]">
        Welcome to Edunancial
      </p>

      <h1 className="mt-6 text-6xl font-black">
        Your Financial Competency Dashboard
      </h1>

      <p className="mt-8 max-w-4xl text-2xl text-slate-300">

        Financial literacy teaches concepts.

        Financial competency teaches you how to apply those concepts
        to build wealth, make better decisions,
        and achieve your financial goals.

      </p>

      <div className="mt-12 flex flex-wrap gap-6">

        <Link
          href="/assessment"
          className="rounded-xl bg-blue-600 px-8 py-5 text-xl font-bold"
        >
          Take Assessment
        </Link>

        <Link
          href="/learning-paths"
          className="rounded-xl border border-white px-8 py-5 text-xl font-bold"
        >
          Learning Paths
        </Link>

        <Link
          href="/dashboard"
          className="rounded-xl border border-yellow-400 px-8 py-5 text-xl font-bold text-yellow-300"
        >
          My Dashboard
        </Link>

      </div>

    </section>
  );
}
