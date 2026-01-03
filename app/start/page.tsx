import Link from "next/link";

export default function StartPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-6 text-4xl font-bold">
        Start With Understanding
      </h1>

      <p className="mb-10 text-lg text-gray-700">
        Before choosing a direction, it’s important to understand
        where you actually are — and why.
      </p>

      <div className="space-y-8">
        <div>
          <h2 className="mb-2 text-2xl font-semibold">
            If you want clarity before decisions
          </h2>
          <Link
            href="/tracks/foundation"
            className="text-blue-600 hover:underline"
          >
            Go to the Foundation Track →
          </Link>
        </div>

        <div>
          <h2 className="mb-2 text-2xl font-semibold">
            If you’re thinking about business
          </h2>
          <Link
            href="/tracks/business"
            className="text-blue-600 hover:underline"
          >
            Go to the Business Track →
          </Link>
        </div>

        <div>
          <h2 className="mb-2 text-2xl font-semibold">
            If you’re considering investing
          </h2>
          <Link
            href="/tracks/investing"
            className="text-blue-600 hover:underline"
          >
            Go to the Investing Track →
          </Link>
        </div>

        <div>
          <h2 className="mb-2 text-2xl font-semibold">
            If you’re thinking long-term and at scale
          </h2>
          <Link
            href="/tracks/advanced"
            className="text-blue-600 hover:underline"
          >
            Go to the Advanced Track →
          </Link>
        </div>
      </div>
    </main>
  );
}
