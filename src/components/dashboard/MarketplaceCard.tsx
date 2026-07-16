import Link from "next/link";

export default function MarketplaceCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold">Marketplace</h2>
      <p className="mt-4 text-slate-600">
        Books, courses, digital tools, and branded merchandise — organized by
        RED, WHITE &amp; BLUE.
      </p>

      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-red-600">RED — Real Estate</span>
          <Link
            href="/marketplace/learn?category=RED"
            className="text-sm font-bold text-blue-700 hover:underline"
          >
            Browse
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-700">
            WHITE — Paper Assets
          </span>
          <Link
            href="/marketplace/learn?category=WHITE"
            className="text-sm font-bold text-blue-700 hover:underline"
          >
            Browse
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-blue-700">BLUE — Business</span>
          <Link
            href="/marketplace/learn?category=BLUE"
            className="text-sm font-bold text-blue-700 hover:underline"
          >
            Browse
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-700">Shop &amp; Merch</span>
          <Link
            href="/marketplace/shop"
            className="text-sm font-bold text-blue-700 hover:underline"
          >
            Browse
          </Link>
        </div>
      </div>

      <Link
        href="/marketplace"
        className="mt-10 block w-full rounded-xl bg-blue-700 px-6 py-3 text-center font-semibold text-white hover:bg-blue-800"
      >
        Open Marketplace
      </Link>
    </section>
  );
}
