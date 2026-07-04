import Link from "next/link";

export default function MembershipHero() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 text-center">

      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
        Membership
      </p>

      <h1 className="text-5xl font-extrabold md:text-6xl">
        Build Financial Competency
      </h1>

      <p className="mx-auto mt-8 max-w-3xl text-xl text-slate-300 leading-9">
        Financial literacy introduces ideas.
        Financial competency develops habits,
        judgment, discipline, and the confidence
        to make better financial decisions for life.
      </p>

      <div className="mt-12 flex flex-wrap justify-center gap-6">

        <Link
          href="/assessment"
          className="rounded-xl bg-blue-600 px-8 py-4 font-bold hover:bg-blue-500"
        >
          Start Free Assessment
        </Link>

        <Link
          href="#pricing"
          className="rounded-xl border border-slate-500 px-8 py-4 font-bold hover:bg-slate-800"
        >
          Compare Memberships
        </Link>

      </div>

    </section>
  );
}
