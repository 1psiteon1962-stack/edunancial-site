"use client";

import { useState } from "react";

import ProductCard from "@/components/marketplace/ProductCard";
import ProductFilters from "@/components/marketplace/ProductFilters";
import { getShopProducts, SHOP_CATEGORIES } from "@/data/marketplace-products";
import type { MarketplaceFilters, MarketplaceProduct } from "@/types/marketplace";

function applyFilters(
  products: MarketplaceProduct[],
  filters: MarketplaceFilters
): MarketplaceProduct[] {
  return products.filter((p) => {
    if (
      filters.availability &&
      !p.availability.includes(
        filters.availability as MarketplaceProduct["availability"][number]
      )
    )
      return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !p.name.toLowerCase().includes(q) &&
        !p.shortDescription.toLowerCase().includes(q) &&
        !(p.tags ?? []).some((t) => t.includes(q))
      )
        return false;
    }
    return true;
  });
}

export default function ShopSection() {
  const allProducts = getShopProducts();
  const [filters, setFilters] = useState<MarketplaceFilters>({
    productType: "merchandise",
  });

  const filtered = applyFilters(allProducts, filters);

  return (
    <div>
      {/* Brand purpose banner */}
      <div className="mb-12 rounded-xl border border-slate-700 bg-slate-900 p-8">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-blue-400">
          Community &amp; Brand
        </p>
        <h2 className="text-3xl font-black text-white">
          More Than Merchandise
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
          Edunancial branded merchandise builds community, increases everyday
          brand visibility, reinforces member identity, and supports our global
          marketing mission. Every item ships worldwide.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          {[
            "🌍 Worldwide Fulfillment",
            "🎯 Member Identity",
            "🤝 Community Building",
            "📣 Brand Visibility",
          ].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div className="mb-10 flex flex-wrap gap-3">
        {SHOP_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() =>
              setFilters((f) => ({
                ...f,
                search: f.search === cat.name ? "" : cat.name,
              }))
            }
            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-blue-500 hover:text-white transition"
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Filters + Grid */}
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full lg:w-64 lg:flex-shrink-0">
          <ProductFilters
            filters={{ ...filters, productType: "merchandise" }}
            onChange={(next) =>
              setFilters({ ...next, productType: "merchandise" })
            }
          />
        </aside>

        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-slate-800 p-12 text-center">
              <p className="text-xl font-bold text-slate-300">
                No products match your filters.
              </p>
              <button
                type="button"
                onClick={() => setFilters({ productType: "merchandise" })}
                className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-slate-400">
                {filtered.length} item{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
