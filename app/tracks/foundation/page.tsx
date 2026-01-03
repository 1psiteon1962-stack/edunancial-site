import Link from "next/link";

export default function FoundationTrackPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-6 text-4xl font-bold">
        Foundation Track
      </h1>

      <p className="mb-8 text-lg text-gray-700">
        This track is designed to give you a clear understanding of how
        money, income, debt, and financial systems actually function.
      </p>

      <ul className="mb-10 list-disc space-y-3 pl-6 text-gray-700">
        <li>How money really moves</li>
        <li>Why income alone doesn’t create stability</li>
        <li>How systems reward structure, not effort</li>
        <li>How to think before acting financially</li>
      </ul>

      <Link
        href="/tracks/business"
        className="inline-block rounded bg-black px-8 py-4 text-white hover:bg-gray-800"
      >
        Continue to Business Track →
      </Link>
    </main>
  );
}
