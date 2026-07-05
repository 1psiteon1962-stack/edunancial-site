import Link from "next/link";

export default function AICoachPreview() {
  return (
    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          AI COACH
        </p>

        <h2 className="mt-6 text-6xl font-black">
          Your Financial Competency Coach
        </h2>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">
          Receive personalized guidance, recommendations,
          progress tracking and learning suggestions based
          on your competency level.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">

          <div className="rounded-xl bg-slate-900 p-8">
            <h3 className="text-2xl font-bold">
              Personalized Learning
            </h3>
          </div>

          <div className="rounded-xl bg-slate-900 p-8">
            <h3 className="text-2xl font-bold">
              Financial Coaching
            </h3>
          </div>

          <div className="rounded-xl bg-slate-900 p-8">
            <h3 className="text-2xl font-bold">
              Progress Tracking
            </h3>
          </div>

        </div>

        <div className="mt-16">

          <Link
            href="/membership"
            className="rounded-xl bg-blue-600 px-10 py-5 font-bold hover:bg-blue-700"
          >
            Learn More
          </Link>

        </div>

      </div>

    </section>
  );
}
