"use client";

import Link from "next/link";

import type { ExperienceLevel, MarketplaceProduct } from "@/types/marketplace";

interface ProductCardProps {
  product: MarketplaceProduct;
}

const CATEGORY_STYLES: Record<string, string> = {
  RED: "border-red-600 text-red-400",
  WHITE: "border-slate-300 text-slate-300",
  BLUE: "border-blue-600 text-blue-400",
  GENERAL: "border-yellow-500 text-yellow-400",
};

const LEVEL_LABEL: Record<ExperienceLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const AVAILABILITY_BADGE: Record<string, string> = {
  "best-seller": "Best Seller",
  featured: "Featured",
  new: "New",
  "on-sale": "On Sale",
};

const AVAILABILITY_COLOR: Record<string, string> = {
  "best-seller": "bg-yellow-600",
  featured: "bg-blue-600",
  new: "bg-green-600",
  "on-sale": "bg-red-600",
};

export default function ProductCard({ product }: ProductCardProps) {
  const categoryStyle =
    CATEGORY_STYLES[product.category] ?? "border-slate-600 text-slate-400";

  const primaryBadge =
    product.availability.find((a) => AVAILABILITY_BADGE[a]) ?? null;

  const categoryLabel =
    product.category === "GENERAL"
      ? product.format
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : `${product.category} — ${
          product.category === "RED"
            ? "Real Estate"
            : product.category === "WHITE"
              ? "Paper Assets"
              : "Business"
        }`;

  return (
    <Link
      href={`/marketplace/product/${product.slug}`}
      className={`group flex flex-col rounded-xl border-l-4 bg-slate-900 p-6 transition hover:bg-slate-800 ${categoryStyle}`}
    >
      {/* Badge row */}
      <div className="mb-4 flex items-center gap-2">
        {primaryBadge && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white ${AVAILABILITY_COLOR[primaryBadge]}`}
          >
            {AVAILABILITY_BADGE[primaryBadge]}
          </span>
        )}
        {product.isDigital && !product.isPhysical && (
          <span className="rounded-full border border-slate-600 px-3 py-1 text-xs font-semibold text-slate-400">
            Digital
          </span>
        )}
        {product.isPhysical && !product.isDigital && (
          <span className="rounded-full border border-slate-600 px-3 py-1 text-xs font-semibold text-slate-400">
            Physical
          </span>
        )}
      </div>

      {/* Category label */}
      <p
        className={`mb-2 text-xs font-bold uppercase tracking-[0.15em] ${categoryStyle.split(" ")[1]}`}
      >
        {categoryLabel}
      </p>

      {/* Title */}
      <h3 className="mb-3 flex-1 text-xl font-black leading-tight text-white group-hover:text-blue-300">
        {product.name}
      </h3>

      {/* Short description */}
      <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-slate-400">
        {product.shortDescription}
      </p>

      {/* Meta row */}
      <div className="mb-5 flex flex-wrap gap-2">
        {product.level && (
          <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
            {LEVEL_LABEL[product.level]}
          </span>
        )}
        {product.completionTime && (
          <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
            {product.completionTime}
          </span>
        )}
        {product.languages.length > 1 && (
          <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
            {product.languages.length} languages
          </span>
        )}
      </div>

      {/* Price row */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-slate-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <span className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition group-hover:bg-blue-700">
          View
        </span>
      </div>
    </Link>
  );
}
