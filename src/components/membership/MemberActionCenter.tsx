import Link from "next/link";

export default function MemberActionCenter() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <div className="rounded-2xl border border-blue-700 bg-blue-950/20 p-10">

        <h2 className="text-4xl font-bold">
          Member Action Center
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <Link
            href="/assessment"
            className="rounded-xl border border-slate-700 p-6 text-center"
          >
            Take Assessment
          </Link>

          <Link
            href="/courses"
            className="rounded-xl border border-slate-700 p-6 text-center"
          >
            Browse Courses
          </Link>

          <Link
            href="/marketplace"
            className="rounded-xl border border-slate-700 p-6 text-center"
          >
            Marketplace
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-700 p-6 text-center"
          >
            Dashboard
          </Link>

        </div>

      </div>

    </section>
  );
}
