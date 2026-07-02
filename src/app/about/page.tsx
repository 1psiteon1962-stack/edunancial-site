import Link from "next/link";

export const metadata = {
  title: "About Edunancial",
  description:
    "Learn why Edunancial exists and why financial competency matters.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <p className="uppercase tracking-[0.4em] text-yellow-400 font-bold">
          ABOUT EDUNANCIAL
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Financial Literacy Is The Foundation.
          <br />
          Financial Competency Is The Objective.
        </h1>

        <p className="mt-12 text-2xl leading-10 text-slate-300">
          Edunancial was created with a simple belief:
          financial education should not end with learning definitions.
          The goal is to develop the ability to make sound financial
          decisions throughout life.
        </p>

        <p className="mt-8 text-2xl leading-10 text-slate-300">
          Our mission is to help ordinary people build extraordinary
          financial lives through practical education, measurable
          competency, and disciplined action.
        </p>

      </section>

      <section className="bg-[#111827]">

        <div className="mx-auto max-w-6xl px-6 py-24">

          <h2 className="text-5xl font-black">
            Why We Exist
          </h2>

          <div className="mt-14 grid gap-8 md:grid-cols-3">

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-3xl font-black text-red-500">
                Learn
              </h3>

              <p className="mt-6 text-slate-300 leading-8">
                Understand the principles behind wealth creation.
              </p>

            </div>

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-3xl font-black text-white">
                Practice
              </h3>

              <p className="mt-6 text-slate-300 leading-8">
                Apply those principles in realistic situations.
              </p>

            </div>

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-3xl font-black text-blue-500">
                Achieve
              </h3>

              <p className="mt-6 text-slate-300 leading-8">
                Build lasting financial competency through experience.
              </p>

            </div>

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">

        <h2 className="text-5xl font-black">
          The Three Pillars
        </h2>

        <div className="mt-16 space-y-10">

          <div>

            <h3 className="text-4xl font-black text-red-500">
              RED
            </h3>

            <p className="mt-4 text-xl leading-9 text-slate-300">
              Real Estate teaches ownership, leverage,
              cash flow, and long-term asset building.
            </p>

          </div>

          <div>

            <h3 className="text-4xl font-black">
              WHITE
            </h3>

            <p className="mt-4 text-xl leading-9 text-slate-300">
              Paper Assets develop investing knowledge,
              portfolio management,
              and long-term wealth accumulation.
            </p>

          </div>

          <div>

            <h3 className="text-4xl font-black text-blue-500">
              BLUE
            </h3>

            <p className="mt-4 text-xl leading-9 text-slate-300">
              Business teaches entrepreneurship,
              profit,
              KPIs,
              leadership,
              and scaling organizations.
            </p>

          </div>

        </div>

      </section>

      <section className="bg-[#0b1326]">

        <div className="mx-auto max-w-6xl px-6 py-24 text-center">

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
            href="/why-edunancial"
            className="mt-12 inline-block rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
          >
            Continue To Our Story
          </Link>

        </div>

      </section>

    </main>
  );
}
