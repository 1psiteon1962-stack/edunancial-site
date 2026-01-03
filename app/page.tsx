export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      {/* HERO SECTION */}
      <section className="mb-20 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
          Financial clarity before commitment.
        </h1>

        <p className="mx-auto mb-6 max-w-3xl text-lg text-gray-700">
          Build the understanding, structure, and decision-readiness required
          to move forward with confidence — in business, investing, and
          long-term wealth.
        </p>

        <p className="mx-auto mb-10 max-w-3xl text-base text-gray-600">
          This platform exists for people who know they need to make better
          financial and business decisions — without theory, hype, or
          trial-and-error.  
          <br />
          <br />
          No classrooms. No credentials. No pressure.  
          Just structured clarity so you can move forward deliberately.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/start"
            className="rounded bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Explore Your Starting Point
          </a>

          <a
            href="/how-it-works"
            className="rounded border border-gray-300 px-6 py-3 text-gray-800 hover:bg-gray-100"
          >
            See How the Platform Works
          </a>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mb-20 text-center">
        <h2 className="mb-4 text-3xl font-semibold">
          This is not about learning more — it’s about understanding enough.
        </h2>

        <p className="mx-auto max-w-3xl text-gray-700">
          Each track is designed to give you clarity before commitment:
          understanding risks, tradeoffs, language, and structure so you can
          evaluate opportunities instead of guessing.
        </p>
      </section>

      {/* TRACKS */}
      <section className="grid gap-10 md:grid-cols-2">
        {/* FOUNDATION */}
        <div className="rounded border p-6">
          <h3 className="mb-2 text-xl font-semibold">
            Foundation — Financial Literacy & Readiness
          </h3>
          <p className="mb-4 text-gray-700">
            Build the base layer most people never receive. Understand how
            money, debt, leverage, and systems actually work before choosing
            any direction.
          </p>
          <a href="/tracks/foundation" className="font-medium text-black underline">
            Start With the Foundation →
          </a>
        </div>

        {/* BUSINESS */}
        <div className="rounded border p-6">
          <h3 className="mb-2 text-xl font-semibold">
            Business — Structure, Profit, and Durability
          </h3>
          <p className="mb-4 text-gray-700">
            Learn how businesses truly function as systems — not ideas —
            including risk, structure, and long-term sustainability.
          </p>
          <a href="/tracks/business" className="font-medium text-black underline">
            Explore the Business Track →
          </a>
        </div>

        {/* INVESTING */}
        <div className="rounded border p-6">
          <h3 className="mb-2 text-xl font-semibold">
            Investing — Decision Clarity Before Capital
          </h3>
          <p className="mb-4 text-gray-700">
            Stop chasing outcomes. Learn how experienced investors evaluate
            setups, risk, and structure before deploying capital.
          </p>
          <a href="/tracks/investing" className="font-medium text-black underline">
            Build Investment Clarity →
          </a>
        </div>

        {/* ADVANCED */}
        <div className="rounded border p-6">
          <h3 className="mb-2 text-xl font-semibold">
            Advanced — Scaling, Protection, and Long-Term Strategy
          </h3>
          <p className="mb-4 text-gray-700">
            Designed for operators and builders thinking beyond short-term
            wins — focusing on protection, durability, and decades-long vision.
          </p>
          <a href="/tracks/advanced" className="font-medium text-black underline">
            See Advanced Frameworks →
          </a>
        </div>
      </section>
    </main>
  );
}
