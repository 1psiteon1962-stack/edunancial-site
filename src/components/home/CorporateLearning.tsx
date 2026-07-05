import Link from "next/link";

export default function CorporateLearning() {
  return (
    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          CORPORATE LEARNING
        </p>

        <h2 className="mt-6 text-6xl font-black">
          Financial Education For Organizations
        </h2>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">
          Help employees improve financial competency through
          structured education, assessments and measurable progress.
        </p>

        <div className="mt-16">

          <Link
            href="/corporate"
            className="rounded-xl bg-blue-600 px-10 py-5 font-bold"
          >
            Corporate Solutions
          </Link>

        </div>

      </div>

    </section>
  );
}
