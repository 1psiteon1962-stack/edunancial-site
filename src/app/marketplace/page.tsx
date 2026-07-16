import type { Metadata } from "next";
import Link from "next/link";

import { getFeaturedProducts } from "@/data/marketplace-products";
import ProductCard from "@/components/marketplace/ProductCard";

export const metadata: Metadata = {
  title: "Marketplace | Edunancial",
  description:
    "The Edunancial Marketplace — educational products, digital downloads, and branded merchandise designed for global financial education. Learn and Shop.",
};

export default function MarketplacePage() {
  const featured = getFeaturedProducts(6);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-blue-400">
          Edunancial Marketplace
        </p>
        <h1 className="text-6xl font-black leading-none md:text-7xl">
          Learn. Shop. Grow.
        </h1>
        <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-300">
          A global marketplace for financial education products and branded
          merchandise — built for the Edunancial community worldwide.
        </p>

        {/* Primary section CTAs */}
        <div className="mt-12 flex flex-wrap gap-6">
          <Link
            href="/marketplace/learn"
            className="group flex flex-col rounded-2xl border border-slate-700 bg-slate-900 p-8 transition hover:border-blue-600 hover:bg-slate-800 md:w-72"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-2xl">
              📚
            </div>
            <h2 className="text-2xl font-black text-white">Learn</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
              Books, eBooks, courses, certifications, templates, workbooks, and
              more — organized by RED, WHITE &amp; BLUE.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-400 group-hover:text-blue-300">
              Browse Learn →
            </span>
          </Link>

          <Link
            href="/marketplace/shop"
            className="group flex flex-col rounded-2xl border border-slate-700 bg-slate-900 p-8 transition hover:border-blue-600 hover:bg-slate-800 md:w-72"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-700 text-2xl">
              🛍️
            </div>
            <h2 className="text-2xl font-black text-white">Shop</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
              Edunancial branded merchandise — apparel, accessories, drinkware,
              stationery, and gift cards. Worldwide fulfillment.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-green-400 group-hover:text-green-300">
              Browse Shop →
            </span>
          </Link>
        </div>
      </section>

      {/* ── Color system legend ────────────────────────────────────── */}
      <section className="border-y border-slate-800 bg-slate-900/50 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-8 text-xs font-black uppercase tracking-[0.25em] text-slate-400">
            The Edunancial System
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex items-start gap-4">
              <span className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-600 font-black text-white">
                R
              </span>
              <div>
                <p className="font-black text-white">RED — Real Estate</p>
                <p className="mt-1 text-sm text-slate-400">
                  Tax liens, tax deeds, rentals, commercial real estate.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-200 font-black text-slate-900">
                W
              </span>
              <div>
                <p className="font-black text-white">WHITE — Paper Assets</p>
                <p className="mt-1 text-sm text-slate-400">
                  Stocks, bonds, options, ETFs, and financial literacy.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 font-black text-white">
                B
              </span>
              <div>
                <p className="font-black text-white">BLUE — Business</p>
                <p className="mt-1 text-sm text-slate-400">
                  Entrepreneurship, profit, systems, and scaling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured products ──────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
              Featured
            </p>
            <h2 className="text-4xl font-black">Marketplace Highlights</h2>
          </div>
          <div className="flex gap-4">
            <Link
              href="/marketplace/learn"
              className="rounded-lg border border-slate-600 px-5 py-3 text-sm font-bold hover:border-white"
            >
              All Learn
            </Link>
            <Link
              href="/marketplace/shop"
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold hover:bg-blue-700"
            >
              All Shop
            </Link>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── Global expansion banner ────────────────────────────────── */}
      <section className="border-t border-slate-800 bg-slate-900/30 py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-blue-400">
            Global Standard
          </p>
          <h2 className="text-3xl font-black">
            Built for Worldwide Reach
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            The Edunancial Marketplace is architected to support local
            languages, currencies, pricing, taxes, and fulfillment across North
            America, Latin America, the Caribbean, Europe, Africa, Asia, and
            every future regional site.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              "North America",
              "Latin America",
              "Caribbean",
              "Europe",
              "Africa",
              "Asia",
              "Middle East",
              "Oceania",
            ].map((region) => (
              <span
                key={region}
                className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300"
              >
                {region}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
