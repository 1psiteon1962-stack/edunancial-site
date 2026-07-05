import Link from "next/link";

export default function FinalCallToAction() {
  return (
    <section className="bg-[#0b1326] py-24">

      <div className="mx-auto max-w-7xl px-6 text-center">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          START TODAY
        </p>

        <h2 className="mt-6 text-6xl font-black">
          Your Financial Future
          <br />
          Starts With One Decision.
        </h2>

        <p className="mx-auto mt-10 max-w-4xl text-2xl leading-10 text-slate-300">
          Build financial competency through education,
          disciplined action and continuous improvement.
        </p>

        <div className="mt-16 flex flex-wrap justify-center gap-6">

          <Link
            href="/membership"
            className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
          >
            Become a Member
          </Link>

          <Link
            href="/assessment"
            className="rounded-xl border border-white px-10 py-5 text-xl font-bold hover:bg-white hover:text-black"
          >
            Take Assessment
          </Link>

        </div>

      </div>

    </section>
  );
}
