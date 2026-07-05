import Link from "next/link";

export default function EntrepreneurCenter() {
  return (
    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          ENTREPRENEURS
        </p>

        <h2 className="mt-6 text-6xl font-black">
          Build Better Businesses
        </h2>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">
          Learn the principles of profit, KPIs, pricing,
          cash flow, leadership, hiring and sustainable
          business growth.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          <div className="rounded-xl bg-slate-900 p-8">
            Profit
          </div>

          <div className="rounded-xl bg-slate-900 p-8">
            KPIs
          </div>

          <div className="rounded-xl bg-slate-900 p-8">
            Cash Flow
          </div>

          <div className="rounded-xl bg-slate-900 p-8">
            Scaling
          </div>

        </div>

        <div className="mt-16">

          <Link
            href="/business"
            className="rounded-xl bg-blue-600 px-10 py-5 font-bold"
          >
            Explore Business Courses
          </Link>

        </div>

      </div>

    </section>
  );
}
