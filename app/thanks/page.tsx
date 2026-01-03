import Link from "next/link";

export default function ThanksPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold">You’re In.</h1>
      <p className="mt-4 text-lg text-gray-700">
        We received your request. Next step: pick your starting track and begin.
      </p>

      <div className="mt-8 rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold">Recommended Start</h2>
        <p className="mt-2 text-gray-700">
          If you’re not sure where to begin, start with the Foundation Track.
          It removes confusion fast and gives you a clean base.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/tracks/foundation"
            className="rounded bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Start Foundation →
          </Link>
          <Link
            href="/tracks"
            className="rounded border border-gray-300 px-6 py-3 text-gray-900 hover:bg-gray-50"
          >
            Choose a different track
          </Link>
        </div>
      </div>

      <p className="mt-10 text-gray-700">
        If you want to understand how this works, read the FAQs.
      </p>

      <div className="mt-4">
        <Link
          href="/faq"
          className="rounded border border-gray-300 px-6 py-3 text-gray-900 hover:bg-gray-50"
        >
          FAQs →
        </Link>
      </div>
    </main>
  );
}
