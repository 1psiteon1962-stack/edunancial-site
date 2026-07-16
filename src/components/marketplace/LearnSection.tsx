"use client";

import { useState } from "react";

import Link from "next/link";

import ProductCard from "@/components/marketplace/ProductCard";
import ProductFilters from "@/components/marketplace/ProductFilters";
import { getLearnProducts, LEARN_CATEGORIES } from "@/data/marketplace-products";
import type { MarketplaceFilters, MarketplaceProduct } from "@/types/marketplace";

function applyFilters(
  products: MarketplaceProduct[],
  filters: MarketplaceFilters
): MarketplaceProduct[] {
  return products.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.productType && p.productType !== filters.productType)
      return false;
    if (filters.level && p.level !== filters.level) return false;
    if (
      filters.availability &&
      !p.availability.includes(
        filters.availability as MarketplaceProduct["availability"][number]
      )
    )
      return false;
    if (
      filters.language &&
      !p.languages.includes(filters.language)
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

const CATEGORY_BORDER: Record<string, string> = {
  RED: "border-red-600",
  WHITE: "border-slate-300",
  BLUE: "border-blue-600",
};

const CATEGORY_TEXT: Record<string, string> = {
  RED: "text-red-400",
  WHITE: "text-slate-200",
  BLUE: "text-blue-400",
};

export default function LearnSection() {
  const allProducts = getLearnProducts();
  const [filters, setFilters] = useState<MarketplaceFilters>({});

  const filtered = applyFilters(allProducts, filters);

  return (
    <div>
      {/* Category overview */}
      <div className="mb-16 grid gap-6 md:grid-cols-3">
        {LEARN_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/marketplace/learn?category=${cat.color}`}
            onClick={() =>
              setFilters((f) => ({ ...f, category: cat.color }))
            }
            className={`group rounded-xl border-l-8 bg-slate-900 p-8 transition hover:bg-slate-800 ${CATEGORY_BORDER[cat.color]}`}
          >
            <p
              className={`text-xs font-black uppercase tracking-[0.2em] ${CATEGORY_TEXT[cat.color]}`}
            >
              {cat.name}
            </p>
            <h3 className="mt-2 text-2xl font-black text-white">
              {cat.description}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {cat.subtitle}
            </p>
          </Link>
        ))}
      </div>

      {/* Filters + Product grid */}
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full lg:w-64 lg:flex-shrink-0">
          <ProductFilters filters={filters} onChange={setFilters} />
        </aside>

        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-slate-800 p-12 text-center">
              <p className="text-xl font-bold text-slate-300">
                No products match your filters.
              </p>
              <button
                type="button"
                onClick={() => setFilters({})}
                className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-slate-400">
                {filtered.length} product{filtered.length !== 1 ? "s" : ""}
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
