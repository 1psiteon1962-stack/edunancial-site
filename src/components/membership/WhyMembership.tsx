export default function WhyMembership() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">
        Why Become A Member?
      </h2>

      <p className="mx-auto mt-8 max-w-4xl text-center text-lg leading-8 text-slate-300">
        Reading one book will not change your financial future.
        Watching one video will not either.
        Financial competency is developed through continuous learning,
        implementation, measurement, and improvement.
      </p>

      <div className="mt-16 grid gap-8 md:grid-cols-3">

        <div className="rounded-xl border border-slate-700 p-8">
          <h3 className="text-2xl font-bold">
            Learn
          </h3>

          <p className="mt-4">
            Learn principles instead of memorizing facts.
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 p-8">
          <h3 className="text-2xl font-bold">
            Practice
          </h3>

          <p className="mt-4">
            Apply what you learn using worksheets,
            calculators and projects.
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 p-8">
          <h3 className="text-2xl font-bold">
            Improve
          </h3>

          <p className="mt-4">
            Track your competency and continue improving throughout life.
          </p>
        </div>

      </div>

    </section>
  );
}
