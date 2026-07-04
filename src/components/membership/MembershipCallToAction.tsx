import Link from "next/link";

export default function MembershipCallToAction() {

  return (

    <section className="mx-auto max-w-7xl px-6 py-24 text-center">

      <h2 className="text-5xl font-bold">
        Ready to Build Financial Competency?
      </h2>

      <p className="mx-auto mt-8 max-w-3xl text-xl text-slate-300">
        Join today. Learn. Practice. Measure.
        Improve for life.
      </p>

      <div className="mt-12 flex flex-wrap justify-center gap-6">

        <Link
          href="/membership"
          className="rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white"
        >
          Become a Member
        </Link>

        <Link
          href="/assessment"
          className="rounded-lg border border-slate-600 px-8 py-4"
        >
          Take Assessment
        </Link>

      </div>

    </section>

  );

}
