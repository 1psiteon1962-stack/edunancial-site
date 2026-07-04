import Link from "next/link";

export default function MembershipPricingBanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <div className="rounded-3xl border border-yellow-500 bg-gradient-to-r from-slate-900 to-slate-800 p-10">

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Membership Plans
        </p>

        <h2 className="mt-4 text-5xl font-bold">
          Choose The Membership That's Right For You
        </h2>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
          Whether you're just beginning or you're an entrepreneur building
          multiple businesses, Edunancial has a membership designed to help
          you continually improve your financial competency.
        </p>

        <div className="mt-12 flex flex-wrap gap-6">

          <Link
            href="/membership"
            className="rounded-xl bg-blue-600 px-8 py-4 font-semibold"
          >
            Compare Memberships
          </Link>

          <Link
            href="/membership/checkout?plan=free"
            className="rounded-xl border border-slate-500 px-8 py-4 font-semibold"
          >
            Start Free
          </Link>

        </div>

      </div>

    </section>
  );
}
