import Link from "next/link";

export default function DecisionLabPreview() {

  return (

    <section className="py-24">

      <div className="mx-auto max-w-6xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          DECISION LAB
        </p>

        <h2 className="mt-6 text-6xl font-black">

          What Would You Do?

        </h2>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h3 className="text-3xl font-black">

            Uganda Restaurant Case

          </h3>

          <p className="mt-8 text-xl leading-9 text-slate-300">

            Customers stopped coming because of a drainage odor
            outside the restaurant.

            Revenue began falling.

            Rent was still due.

            Cash reserves were shrinking.

          </p>

          <p className="mt-8 text-2xl font-bold">

            What would you do first?

          </p>

          <div className="mt-10 grid gap-4">

            <button className="rounded-xl bg-slate-800 p-5 text-left">
              A. Lower Prices
            </button>

            <button className="rounded-xl bg-slate-800 p-5 text-left">
              B. Close The Restaurant
            </button>

            <button className="rounded-xl bg-slate-800 p-5 text-left">
              C. Build A Delivery Business
            </button>

            <button className="rounded-xl bg-slate-800 p-5 text-left">
              D. Borrow More Money
            </button>

          </div>

          <div className="mt-12">

            <Link
              href="/decision-labs"
              className="rounded-xl bg-blue-600 px-10 py-5 font-bold"
            >
              Enter Decision Lab
            </Link>

          </div>

        </div>

      </div>

    </section>

  );

}
