import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import {
  getProductBySlug,
  MARKETPLACE_PRODUCTS,
  getFeaturedProducts,
} from "@/data/marketplace-products";
import ProductCard from "@/components/marketplace/ProductCard";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return MARKETPLACE_PRODUCTS.map((p) => ({ id: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProductBySlug(id);
  if (!product) return { title: "Product Not Found | Edunancial Marketplace" };
  return {
    title: `${product.name} | Edunancial Marketplace`,
    description: product.shortDescription,
  };
}

const CATEGORY_BORDER: Record<string, string> = {
  RED: "border-red-600",
  WHITE: "border-slate-300",
  BLUE: "border-blue-600",
  GENERAL: "border-yellow-500",
};

const CATEGORY_TEXT: Record<string, string> = {
  RED: "text-red-400",
  WHITE: "text-slate-200",
  BLUE: "text-blue-400",
  GENERAL: "text-yellow-400",
};

const CATEGORY_LABEL: Record<string, string> = {
  RED: "RED — Real Estate",
  WHITE: "WHITE — Paper Assets",
  BLUE: "BLUE — Business",
  GENERAL: "General",
};

const LEVEL_LABEL: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = getProductBySlug(id);

  if (!product) notFound();

  const related = product.relatedProductIds
    ? MARKETPLACE_PRODUCTS.filter((p) =>
        product.relatedProductIds!.includes(p.id)
      )
    : getFeaturedProducts(3).filter((p) => p.id !== product.id).slice(0, 3);

  const borderClass = CATEGORY_BORDER[product.category] ?? "border-slate-600";
  const textClass = CATEGORY_TEXT[product.category] ?? "text-slate-400";

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      {/* ── Breadcrumb ─────────────────────────────────────────────── */}
      <div className="border-b border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-400">
            <Link href="/marketplace" className="hover:text-white">
              Marketplace
            </Link>
            <span>›</span>
            {product.productType === "merchandise" ? (
              <Link href="/marketplace/shop" className="hover:text-white">
                Shop
              </Link>
            ) : (
              <Link href="/marketplace/learn" className="hover:text-white">
                Learn
              </Link>
            )}
            <span>›</span>
            <span className="text-white">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Product detail ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: image placeholder */}
          <div
            className={`flex min-h-72 items-center justify-center rounded-2xl border-l-8 bg-slate-900 ${borderClass}`}
          >
            <div className="text-center">
              <div className="mb-4 text-6xl">
                {product.productType === "merchandise" ? "🛍️" : "📚"}
              </div>
              <p className="text-sm text-slate-500">Product image coming soon</p>
            </div>
          </div>

          {/* Right: info */}
          <div>
            {/* Category tag */}
            <p className={`mb-3 text-xs font-black uppercase tracking-[0.2em] ${textClass}`}>
              {CATEGORY_LABEL[product.category]}
            </p>

            <h1 className="text-4xl font-black leading-tight">{product.name}</h1>

            {/* Rating */}
            {product.rating && (
              <div className="mt-4 flex items-center gap-3">
                <div className="flex gap-1 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < Math.round(product.rating!) ? "★" : "☆"}</span>
                  ))}
                </div>
                <span className="text-sm text-slate-400">
                  {product.rating.toFixed(1)} ({product.reviewCount ?? 0} reviews)
                </span>
              </div>
            )}

            {/* Meta badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {product.level && (
                <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                  {LEVEL_LABEL[product.level]}
                </span>
              )}
              {product.completionTime && (
                <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                  ⏱ {product.completionTime}
                </span>
              )}
              {product.isDigital && !product.isPhysical && (
                <span className="rounded-full border border-blue-700 px-3 py-1 text-xs font-semibold text-blue-300">
                  Digital Download
                </span>
              )}
              {product.isPhysical && !product.isDigital && (
                <span className="rounded-full border border-green-700 px-3 py-1 text-xs font-semibold text-green-300">
                  Physical Product
                </span>
              )}
              {product.languages.length > 1 && (
                <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                  {product.languages
                    .map((l) => l.toUpperCase())
                    .join(" / ")}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-6 leading-relaxed text-slate-300">
              {product.description}
            </p>

            {/* Price + CTA */}
            <div className="mt-8 flex items-center gap-6">
              <div>
                <span className="text-4xl font-black">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="ml-3 text-lg text-slate-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="ml-2 text-sm text-slate-500">{product.currency}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                type="button"
                className="rounded-xl bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-700"
              >
                Add to Cart
              </button>
              <button
                type="button"
                className="rounded-xl border border-slate-600 px-8 py-4 font-bold hover:border-white"
              >
                Save for Later
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              🌍 Worldwide fulfillment available. Regional pricing coming soon.
            </p>
          </div>
        </div>

        {/* ── Learning objectives ─────────────────────────────────── */}
        {product.learningObjectives && product.learningObjectives.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-black">What You Will Learn</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {product.learningObjectives.map((obj) => (
                <li key={obj} className="flex items-start gap-3">
                  <span className="mt-1 text-green-400">✓</span>
                  <span className="text-slate-300">{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Specifications ──────────────────────────────────────── */}
        {product.specifications &&
          Object.keys(product.specifications).length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 text-2xl font-black">
                {product.productType === "merchandise"
                  ? "Product Specifications"
                  : "Details"}
              </h2>
              <div className="rounded-xl border border-slate-800 overflow-hidden">
                {Object.entries(product.specifications).map(
                  ([key, value], i) => (
                    <div
                      key={key}
                      className={`flex justify-between px-6 py-4 ${
                        i % 2 === 0 ? "bg-slate-900" : "bg-slate-900/50"
                      }`}
                    >
                      <span className="font-semibold text-slate-300">{key}</span>
                      <span className="text-white">{value}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        {/* ── FAQs ────────────────────────────────────────────────── */}
        {product.faqs && product.faqs.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-black">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {product.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-6 py-5"
                >
                  <summary className="cursor-pointer font-bold text-white">
                    {faq.question}
                  </summary>
                  <p className="mt-4 leading-relaxed text-slate-300">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* ── Reviews placeholder ─────────────────────────────────── */}
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-black">Reviews</h2>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
            {product.rating && product.reviewCount ? (
              <div>
                <div className="flex justify-center gap-1 text-3xl text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < Math.round(product.rating!) ? "★" : "☆"}</span>
                  ))}
                </div>
                <p className="mt-3 text-xl font-bold">
                  {product.rating.toFixed(1)} out of 5
                </p>
                <p className="mt-1 text-slate-400">
                  Based on {product.reviewCount} reviews
                </p>
              </div>
            ) : (
              <p className="text-slate-400">
                No reviews yet. Be the first to review this product.
              </p>
            )}
            <button
              type="button"
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700"
            >
              Write a Review
            </button>
          </div>
        </div>

        {/* ── Related products ────────────────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 text-2xl font-black">Related Products</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
