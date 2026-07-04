import Link from "next/link";

export default function QuickActions() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold">
        Quick Actions
      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        <Link
          href="/assessment/start"
          className="rounded-xl bg-blue-700 p-5 text-center font-semibold text-white transition hover:bg-blue-800"
        >
          Take Assessment
        </Link>

        <Link
          href="/courses"
          className="rounded-xl bg-slate-900 p-5 text-center font-semibold text-white transition hover:bg-slate-800"
        >
          Continue Courses
        </Link>

        <Link
          href="/marketplace"
          className="rounded-xl bg-emerald-700 p-5 text-center font-semibold text-white transition hover:bg-emerald-800"
        >
          Marketplace
        </Link>

        <Link
          href="/membership"
          className="rounded-xl bg-purple-700 p-5 text-center font-semibold text-white transition hover:bg-purple-800"
        >
          Membership
        </Link>

        <Link
          href="/passport"
          className="rounded-xl bg-amber-600 p-5 text-center font-semibold text-white transition hover:bg-amber-700"
        >
          Financial Passport
        </Link>

        <Link
          href="/account"
          className="rounded-xl bg-slate-600 p-5 text-center font-semibold text-white transition hover:bg-slate-700"
        >
          Account Settings
        </Link>

      </div>

    </section>
  );
}
