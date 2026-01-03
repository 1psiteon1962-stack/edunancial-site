import Link from "next/link";

export default function BusinessTrackPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-6 text-4xl font-bold">
        Business Track
      </h1>

      <p className="mb-8 text-lg text-gray-700">
        This track focuses on understanding business as a system —
        not hustle, not branding, not noise.
      </p>

      <ul className="mb-10 list-disc space-y-3 pl-6 text-gray-700">
        <li>Why most businesses fail structurally</li>
        <li>Entity choices and long-term consequences</li>
        <li>Cash flow vs profit vs valuation</li>
        <li>When a business makes sense — and when it doesn’t</li>
      </ul>

      <Link
        href="/tracks/investing"
        className="inline-block rounded bg-black px-8 py-4 text-white hover:bg-gray-800"
      >
        Continue to Investing Track →
      </Link>
    </main>
  );
}
