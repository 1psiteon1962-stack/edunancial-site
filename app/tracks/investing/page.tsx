import Link from "next/link";

export default function InvestingTrackPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-6 text-4xl font-bold">
        Investing Track
      </h1>

      <p className="mb-8 text-lg text-gray-700">
        This track explains investing from a literacy perspective —
        not speculation, not tips, not promises.
      </p>

      <ul className="mb-10 list-disc space-y-3 pl-6 text-gray-700">
        <li>What investing actually is</li>
        <li>Risk vs uncertainty</li>
        <li>Why timing is rarely the real issue</li>
        <li>How structure determines outcomes</li>
      </ul>

      <Link
        href="/tracks/advanced"
        className="inline-block rounded bg-black px-8 py-4 text-white hover:bg-gray-800"
      >
        Continue to Advanced Track →
      </Link>
    </main>
  );
}
