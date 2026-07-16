"use client";

import type {
  AvailabilityTag,
  ExperienceLevel,
  MarketplaceFilters,
  ProductCategory,
  ProductLanguage,
  ProductType,
} from "@/types/marketplace";

interface ProductFiltersProps {
  filters: MarketplaceFilters;
  onChange: (next: MarketplaceFilters) => void;
}

const CATEGORIES: Array<{ value: ProductCategory | ""; label: string }> = [
  { value: "", label: "All Categories" },
  { value: "RED", label: "RED — Real Estate" },
  { value: "WHITE", label: "WHITE — Paper Assets" },
  { value: "BLUE", label: "BLUE — Business" },
  { value: "GENERAL", label: "General" },
];

const PRODUCT_TYPES: Array<{ value: ProductType | ""; label: string }> = [
  { value: "", label: "All Types" },
  { value: "education", label: "Education" },
  { value: "merchandise", label: "Merchandise" },
  { value: "digital", label: "Digital" },
  { value: "physical", label: "Physical" },
  { value: "bundle", label: "Bundle" },
];

const LEVELS: Array<{ value: ExperienceLevel | ""; label: string }> = [
  { value: "", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const AVAILABILITY: Array<{ value: AvailabilityTag | ""; label: string }> = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "featured", label: "Featured" },
  { value: "best-seller", label: "Best Seller" },
  { value: "on-sale", label: "On Sale" },
];

const LANGUAGES: Array<{ value: ProductLanguage | ""; label: string }> = [
  { value: "", label: "All Languages" },
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "pt", label: "Portuguese" },
  { value: "ar", label: "Arabic" },
];

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ProductFilters({
  filters,
  onChange,
}: ProductFiltersProps) {
  function set<K extends keyof MarketplaceFilters>(
    key: K,
    value: MarketplaceFilters[K]
  ) {
    onChange({ ...filters, [key]: value });
  }

  const hasActiveFilters =
    filters.category ||
    filters.productType ||
    filters.level ||
    filters.availability ||
    filters.language ||
    filters.search;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-bold text-white">Filter Products</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() =>
              onChange({
                category: "",
                productType: "",
                level: "",
                availability: "",
                language: "",
                search: "",
              })
            }
            className="text-xs font-semibold text-blue-400 hover:text-blue-300"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-5 flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Search
        </label>
        <input
          type="text"
          placeholder="Search products…"
          value={filters.search ?? ""}
          onChange={(e) => set("search", e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <FilterSelect
          label="Category"
          value={filters.category ?? ""}
          options={CATEGORIES}
          onChange={(v) => set("category", v)}
        />
        <FilterSelect
          label="Product Type"
          value={filters.productType ?? ""}
          options={PRODUCT_TYPES}
          onChange={(v) => set("productType", v)}
        />
        <FilterSelect
          label="Experience Level"
          value={filters.level ?? ""}
          options={LEVELS}
          onChange={(v) => set("level", v)}
        />
        <FilterSelect
          label="Availability"
          value={filters.availability ?? ""}
          options={AVAILABILITY}
          onChange={(v) => set("availability", v)}
        />
        <FilterSelect
          label="Language"
          value={filters.language ?? ""}
          options={LANGUAGES}
          onChange={(v) => set("language", v)}
        />
      </div>
    </div>
  );
}
