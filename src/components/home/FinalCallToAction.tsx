import Link from "next/link";

export default function FinalCallToAction() {

  return (

    <section className="bg-gradient-to-r from-blue-900 via-slate-900 to-red-900 py-28">

      <div className="mx-auto max-w-5xl px-6 text-center">

        <h2 className="text-6xl font-black">

          Stop Memorizing.

          <br />

          Start Building Financial Competency.

        </h2>

        <p className="mt-10 text-2xl leading-10 text-slate-300">

          Better thinking creates better decisions.

          Better decisions create better businesses.

          Better businesses build stronger communities.

        </p>

        <div className="mt-16 flex flex-wrap justify-center gap-6">

          <Link
            href="/membership"
            className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold"
          >

            Become A Member

          </Link>

          <Link
            href="/assessment"
            className="rounded-xl border border-white px-10 py-5 text-xl font-bold hover:bg-white hover:text-black"
          >

            Take The Assessment

          </Link>

        </div>

      </div>

    </section>

  );

}
