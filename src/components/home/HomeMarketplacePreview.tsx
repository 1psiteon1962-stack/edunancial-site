import Link from "next/link";

import { getFeaturedProducts } from "@/data/marketplace-products";
import ProductCard from "@/components/marketplace/ProductCard";

export default function HomeMarketplacePreview() {
  const featured = getFeaturedProducts(4);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-blue-400">
          Marketplace
        </p>
        <h2 className="text-5xl font-black md:text-6xl">
          Learn &amp; Shop
        </h2>
        <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-300">
          Books, courses, digital tools, and branded merchandise — all in one
          place. Organized by RED, WHITE &amp; BLUE.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
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

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/marketplace"
            className="inline-block rounded-xl bg-slate-900 px-8 py-5 font-bold border border-slate-700 hover:border-blue-500 transition"
          >
            Explore Full Marketplace →
          </Link>
        </div>
      </div>
    </section>
  );
}
