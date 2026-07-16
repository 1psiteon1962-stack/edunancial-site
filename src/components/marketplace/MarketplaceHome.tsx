import Link from "next/link";

import { getFeaturedProducts } from "@/data/marketplace-products";
import ProductCard from "@/components/marketplace/ProductCard";

export default function MarketplaceHome() {
  const featured = getFeaturedProducts(4);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-blue-400">
          Edunancial Marketplace
        </p>
        <h1 className="text-5xl font-black">
          Learn. Shop. Grow.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">
          A global marketplace for financial education products and branded
          merchandise — built for the Edunancial community worldwide.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/marketplace/learn"
            className="rounded-xl bg-blue-600 px-6 py-4 font-bold hover:bg-blue-700"
          >
            Browse Learn
          </Link>
          <Link
            href="/marketplace/shop"
            className="rounded-xl border border-slate-600 px-6 py-4 font-bold hover:border-white"
          >
            Browse Shop
          </Link>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
