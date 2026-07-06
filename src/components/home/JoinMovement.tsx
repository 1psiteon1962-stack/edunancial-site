import Link from "next/link";

export default function JoinMovement() {

  return (

    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-5xl px-6 text-center">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          JOIN THE MOVEMENT

        </p>

        <h2 className="mt-6 text-6xl font-black">

          Build Financial Competency

        </h2>

        <p className="mt-10 text-2xl leading-10 text-slate-300">

          Start learning.

          Practice deliberately.

          Measure your progress.

          Build lasting wealth.

        </p>

        <div className="mt-16">

          <Link
            href="/membership"
            className="rounded-xl bg-blue-600 px-10 py-5 font-bold"
          >

            Become A Member

          </Link>

        </div>

      </div>

    </section>

  );

}
