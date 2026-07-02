import Link from "next/link";

export default function HomeAssessmentPreview() {
  return (
    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.4em] text-yellow-400">
          START HERE
        </p>

        <h2 className="mt-6 text-6xl font-black text-white">
          Discover Your Financial Competency
        </h2>

        <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">
          Don't guess where you should begin.
          Measure your current competency and receive a personalized learning roadmap.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          <Stat title="Business" />

          <Stat title="Investing" />

          <Stat title="Real Estate" />

          <Stat title="Financial Foundations" />

        </div>

        <div className="mt-16">

          <Link
            href="/assessment"
            className="rounded-xl bg-blue-600 px-8 py-5 text-xl font-bold hover:bg-blue-700"
          >

            Start Assessment

          </Link>

        </div>

      </div>

    </section>
  );
}

function Stat({ title }: { title: string }) {
  return (
    <div className="rounded-xl bg-slate-900 p-8">

      <h3 className="text-2xl font-black text-white">

        {title}

      </h3>

      <p className="mt-4 text-slate-300">

        Measure your competency.

      </p>

    </div>
  );
}
