import Link from "next/link";

export const metadata = {
  title: "Our Philosophy | Edunancial",
  description:
    "The philosophy behind Edunancial's approach to financial literacy and financial competency.",
};

export default function PhilosophyPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <p className="uppercase tracking-[0.4em] font-bold text-yellow-400">
          OUR PHILOSOPHY
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Knowledge Is Only
          <br />
          The Beginning.
        </h1>

        <p className="mt-12 text-2xl leading-10 text-slate-300">
          Most financial education stops after explaining concepts.
          We believe education should continue until those concepts
          become habits and sound financial decisions.
        </p>

        <p className="mt-8 text-2xl leading-10 text-blue-400 font-semibold">
          Financial literacy provides the foundation.
          Financial competency is built through disciplined action.
        </p>

      </section>

      <section className="bg-[#111827]">

        <div className="mx-auto max-w-6xl px-6 py-24">

          <h2 className="text-5xl font-black">
            What We Believe
          </h2>

          <div className="mt-16 grid gap-8 md:grid-cols-2">

            <div className="rounded-xl bg-slate-900 p-8">
              <h3 className="text-3xl font-black text-red-500">
                Education
              </h3>

              <p className="mt-6 text-slate-300 leading-8">
                Everyone deserves access to practical financial education.
              </p>
            </div>

            <div className="rounded-xl bg-slate-900 p-8">
              <h3 className="text-3xl font-black text-blue-500">
                Responsibility
              </h3>

              <p className="mt-6 text-slate-300 leading-8">
                Better decisions come from knowledge combined with action.
              </p>
            </div>

            <div className="rounded-xl bg-slate-900 p-8">
              <h3 className="text-3xl font-black text-green-400">
                Measurement
              </h3>

              <p className="mt-6 text-slate-300 leading-8">
                Progress should be measured, not guessed.
              </p>
            </div>

            <div className="rounded-xl bg-slate-900 p-8">
              <h3 className="text-3xl font-black text-yellow-400">
                Lifelong Learning
              </h3>

              <p className="mt-6 text-slate-300 leading-8">
                Financial competency is a journey, not a destination.
              </p>
            </div>

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 text-center">

        <h2 className="text-5xl font-black">
          Economic Self Defense
        </h2>

        <p className="mt-8 text-2xl leading-10 text-slate-300">
          Learn.
          Earn.
          Save.
          Invest.
          Build Wealth.
        </p>

        <Link
          href="/assessment"
          className="mt-12 inline-block rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
        >
          Measure Your Competency
        </Link>

      </section>

    </main>
  );
}
