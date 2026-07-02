import Link from "next/link";

export default function HomeMissionPreview() {
  return (
    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-6xl font-black">

          Mission of the Week

        </h2>

        <div className="mt-12 rounded-xl bg-slate-900 p-10">

          <h3 className="text-3xl font-black">

            Know Your Numbers

          </h3>

          <p className="mt-8 text-xl leading-9 text-slate-300">

            Select one business.

            Determine its revenue.

            Determine its profit.

            Explain why profit is more important than revenue.

          </p>

          <Link
            href="/missions"
            className="mt-10 inline-block rounded-xl bg-green-600 px-8 py-4 font-bold"
          >

            View Mission Center

          </Link>

        </div>

      </div>

    </section>
  );
}
