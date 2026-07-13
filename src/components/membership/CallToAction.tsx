import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 text-center">

      <h2 className="text-5xl font-bold">
        Start Building Your Financial Future Today
      </h2>

      <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
        Join thousands of future members who are committed to building
        financial competency one decision at a time.
      </p>

      <div className="mt-12 flex flex-wrap justify-center gap-6">

        <Link
          href="/membership/checkout?plan=basic"
          className="rounded-xl bg-blue-600 px-8 py-4 font-bold"
        >
          Start Individual Membership
        </Link>

        <Link
          href="/contact"
          className="rounded-xl bg-green-600 px-8 py-4 font-bold"
        >
          Approved Organization Membership
        </Link>

        <Link
          href="/contact"
          className="rounded-xl bg-yellow-500 px-8 py-4 font-bold text-black"
        >
          100+ Member Organization Rate
        </Link>

      </div>

    </section>
  );
}
