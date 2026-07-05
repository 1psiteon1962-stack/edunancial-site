import Link from "next/link";

export default function LearningPathHero() {
  return (
    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          LEARNING PATHS
        </p>

        <h1 className="mt-6 text-6xl font-black">

          Learn In The Right Order.

        </h1>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

          Financial competency is built progressively.

          Every lesson prepares you for the next decision.

          Every completed competency unlocks the next stage of your journey.

        </p>

        <div className="mt-16">

          <Link
            href="/learning-paths"
            className="rounded-xl bg-blue-600 px-10 py-5 font-bold hover:bg-blue-700"
          >
            View Learning Paths
          </Link>

        </div>

      </div>

    </section>
  );
}
