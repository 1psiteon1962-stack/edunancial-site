export const metadata = {
  title: "Our Philosophy | Edunancial",
  description:
    "Learn the philosophy behind Edunancial and why Financial Competency is our mission.",
};

export default function PhilosophyPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">

          OUR PHILOSOPHY

        </p>

        <h1 className="mt-8 text-7xl font-black">

          Knowledge Alone
          <br />
          Is Not Enough

        </h1>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

          Information is everywhere.

          Competency is rare.

        </p>

      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">

        <div className="space-y-10 text-xl leading-10 text-slate-300">

          <p>

            Reading a book does not automatically make someone an investor.

          </p>

          <p>

            Watching a video does not automatically create an entrepreneur.

          </p>

          <p>

            Memorizing financial terminology does not automatically improve financial decisions.

          </p>

          <p>

            True competency develops when knowledge is repeatedly applied in real life.

          </p>

        </div>

      </section>

      <section className="bg-[#111827]">

        <div className="mx-auto max-w-6xl px-6 py-24">

          <h2 className="text-center text-5xl font-black">

            The Edunancial Model

          </h2>

          <div className="mt-20 grid gap-8 md:grid-cols-4">

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-2xl font-black">

                Learn

              </h3>

              <p className="mt-5">

                Understand the concepts.

              </p>

            </div>

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-2xl font-black">

                Apply

              </h3>

              <p className="mt-5">

                Practice using simulations and missions.

              </p>

            </div>

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-2xl font-black">

                Measure

              </h3>

              <p className="mt-5">

                Track competency and progress.

              </p>

            </div>

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-2xl font-black">

                Improve

              </h3>

              <p className="mt-5">

                Continue developing better decisions.

              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
