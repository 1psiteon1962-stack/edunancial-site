import Link from "next/link";

export const metadata = {
  title: "Economic Self Defense | Edunancial",
  description:
    "Economic Self Defense is the ability to make informed financial decisions that protect and improve your family's future.",
};

export default function EconomicSelfDefensePage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <p className="uppercase tracking-[0.4em] font-bold text-yellow-400">
          ECONOMIC SELF DEFENSE
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Protect Your Future.
          <br />
          Build Your Future.
        </h1>

        <p className="mt-12 text-2xl leading-10 text-slate-300">

          Every day we make financial decisions.

          Some move us forward.

          Some hold us back.

          Economic Self Defense means having the knowledge,
          skills,
          and competency to consistently make better decisions.

        </p>

      </section>

      <section className="bg-[#111827]">

        <div className="mx-auto max-w-6xl px-6 py-24">

          <h2 className="text-5xl font-black">

            What Does It Mean?

          </h2>

          <div className="mt-16 grid gap-8 md:grid-cols-2">

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-3xl font-black text-red-500">

                Protect

              </h3>

              <ul className="mt-8 space-y-4 text-xl text-slate-300">

                <li>Protect your income.</li>

                <li>Protect your family.</li>

                <li>Avoid unnecessary debt.</li>

                <li>Manage financial risk.</li>

              </ul>

            </div>

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-3xl font-black text-blue-500">

                Build

              </h3>

              <ul className="mt-8 space-y-4 text-xl text-slate-300">

                <li>Create assets.</li>

                <li>Start businesses.</li>

                <li>Invest wisely.</li>

                <li>Develop multiple income streams.</li>

              </ul>

            </div>

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">

        <h2 className="text-5xl font-black">

          The Edunancial Formula

        </h2>

        <div className="mt-16 space-y-8">

          <div className="rounded-xl bg-slate-900 p-8">

            <h3 className="text-3xl font-black">

              Learn

            </h3>

            <p className="mt-4 text-xl leading-9 text-slate-300">

              Build financial literacy.

            </p>

          </div>

          <div className="rounded-xl bg-slate-900 p-8">

            <h3 className="text-3xl font-black">

              Practice

            </h3>

            <p className="mt-4 text-xl leading-9 text-slate-300">

              Apply concepts through missions and simulations.

            </p>

          </div>

          <div className="rounded-xl bg-slate-900 p-8">

            <h3 className="text-3xl font-black">

              Measure

            </h3>

            <p className="mt-4 text-xl leading-9 text-slate-300">

              Assess your financial competency.

            </p>

          </div>

          <div className="rounded-xl bg-slate-900 p-8">

            <h3 className="text-3xl font-black">

              Improve

            </h3>

            <p className="mt-4 text-xl leading-9 text-slate-300">

              Continue developing better financial decisions throughout life.

            </p>

          </div>

        </div>

      </section>

      <section className="bg-[#0b1326]">

        <div className="mx-auto max-w-6xl px-6 py-24 text-center">

          <h2 className="text-5xl font-black">

            Your Strongest Investment
            <br />
            Is Yourself.

          </h2>

          <p className="mt-8 text-2xl leading-10 text-slate-300">

            Knowledge.

            Competency.

            Discipline.

            Action.

          </p>

          <Link
            href="/assessment"
            className="mt-12 inline-block rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
          >

            Start Your Assessment

          </Link>

        </div>

      </section>

    </main>
  );
}
