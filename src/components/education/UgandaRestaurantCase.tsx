import Link from "next/link";

export default function UgandaRestaurantCase() {
  return (
    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          CASE STUDY
        </p>

        <h2 className="mt-6 text-6xl font-black">
          Uganda Restaurant
        </h2>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">

          <div className="rounded-xl bg-slate-900 p-8">

            <h3 className="text-2xl font-black">
              Background
            </h3>

            <p className="mt-6 text-slate-300 leading-8">
              A small startup restaurant opened with limited capital,
              high expectations and a commitment to serving affordable meals.
            </p>

          </div>

          <div className="rounded-xl bg-slate-900 p-8">

            <h3 className="text-2xl font-black">
              The Problem
            </h3>

            <p className="mt-6 text-slate-300 leading-8">
              A drainage odor outside the restaurant caused customer traffic
              to decline despite the quality of the food.
            </p>

          </div>

        </div>

        <div className="mt-16">

          <Link
            href="/case-studies/uganda-restaurant"
            className="rounded-xl bg-blue-600 px-10 py-5 font-bold"
          >
            Study This Case
          </Link>

        </div>

      </div>

    </section>
  );
}
