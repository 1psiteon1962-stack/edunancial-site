import { Suspense } from "react";

export default function TracksPage({
  searchParams,
}: {
  searchParams: { level?: string };
}) {
  const level = Number(searchParams.level ?? 1);

  return (
    <main>
      <h1>Your Wealth Tracks</h1>
      <p>Suggested starting level: Level {level}</p>

      <section>
        <h2>Red Track — Real Estate</h2>
        <p>Property, land, rentals, and structured ownership.</p>
      </section>

      <section>
        <h2>White Track — Paper Assets</h2>
        <p>Stocks, options, bonds, and market instruments.</p>
      </section>

      <section>
        <h2>Blue Track — Business</h2>
        <p>Operating companies, equity, and scalable systems.</p>
      </section>
    </main>
  );
}
