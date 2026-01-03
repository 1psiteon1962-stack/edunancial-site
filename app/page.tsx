import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      {/* HERO */}
      <section className="mb-20 max-w-4xl">
        <h1 className="text-5xl font-bold leading-tight">
          Financial Literacy,
          <br />
          Structured for Real Life
        </h1>

        <p className="mt-6 text-xl text-gray-700">
          This is not hype. Not shortcuts. Not speculation.
          <br />
          This is financial literacy built as a system — so you always know
          what to do next.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/start"
            className="rounded bg-black px-8 py-4 text-lg text-white hover:bg-gray-800"
          >
            Start Here →
          </Link>

          <Link
            href="/tracks"
            className="rounded border border-gray-300 px-8 py-4 text-lg text-gray-900 hover:bg-gray-50"
          >
            View Tracks
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-600">
          Built for clarity. Designed for decision-making.
        </p>
      </section>

      {/* WHAT THIS IS */}
      <section className="mb-20 max-w-5xl">
        <h2 className="text-3xl font-semibold">
          What This Platform Actually Does
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold">Explains the system</h3>
            <p className="mt-2 text-gray-700">
              Money, income, debt, business, investing — explained as a system,
              not isolated tips.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold">Gives you a path</h3>
            <p className="mt-2 text-gray-700">
              You always know where you are, what comes next, and why it matters.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold">Builds decision skill</h3>
            <p className="mt-2 text-gray-700">
              The goal isn’t information — it’s better decisions over time.
            </p>
          </div>
        </div>
      </section>

      {/* TRACKS */}
      <section className="mb-20">
        <h2 className="text-3xl font-semibold">Choose Your Track</h2>
        <p className="mt-3 max-w-3xl text-lg text-gray-700">
          Start where you are. Each track builds a specific type of literacy.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Link
            href="/tracks/foundation"
            className="block rounded-lg border border-gray-200 p-6 hover:bg-gray-50"
          >
            <h3 className="text-2xl font-semibold">Foundation</h3>
            <p className="mt-2 text-gray-700">
              Understand money, income, debt, and personal structure.
            </p>
            <p className="mt-4 font-medium">Start here →</p>
          </Link>

          <Link
            href="/tracks/business"
            className="block rounded-lg border border-gray-200 p-6 hover:bg-gray-50"
          >
            <h3 className="text-2xl font-semibold">Business</h3>
            <p className="mt-2 text-gray-700">
              Learn how business structure creates income, leverage, and protection.
            </p>
            <p className="mt-4 font-medium">Open track →</p>
          </Link>

          <Link
            href="/tracks/investing"
            className="block rounded-lg border border-gray-200 p-6 hover:bg-gray-50"
          >
            <h3 className="text-2xl font-semibold">Investing</h3>
            <p className="mt-2 text-gray-700">
              Learn investing as literacy — not gambling or hype.
            </p>
            <p className="mt-4 font-medium">Open track →</p>
          </Link>

          <Link
            href="/tracks/advanced"
            className="block rounded-lg border border-gray-200 p-6 hover:bg-gray-50"
          >
            <h3 className="text-2xl font-semibold">Advanced</h3>
            <p className="mt-2 text-gray-700">
              Systems-level thinking: scale, control, and long-term positioning.
            </p>
            <p className="mt-4 font-medium">Open track →</p>
          </Link>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="rounded-lg border border-gray-200 p-10">
        <h2 className="text-3xl font-semibold">
          Not Sure Where to Start?
        </h2>

        <p className="mt-3 max-w-3xl text-lg text-gray-700">
          Most people begin with the Foundation Track.  
          It removes confusion fast and creates a solid base.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/start"
            className="rounded bg-black px-8 py-4 text-lg text-white hover:bg-gray-800"
          >
            Start Here →
          </Link>

          <Link
            href="/faq"
            className="rounded border border-gray-300 px-8 py-4 text-lg text-gray-900 hover:bg-gray-50"
          >
            FAQs
          </Link>
        </div>
      </section>
    </main>
  );
}
