"use client";

import { useState } from "react";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

export interface SearchFilterProps {
  onSearch: (query: string) => void;
  filters?: FilterConfig[];
  onFilter?: (key: string, value: string) => void;
  placeholder?: string;
}

export default function SearchFilter({
  onSearch,
  filters = [],
  onFilter,
  placeholder = "Search…",
}: SearchFilterProps) {
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#101a2f] p-4 sm:flex-row sm:items-center sm:flex-wrap">
      <div className="flex-1 min-w-[220px]">
        <label htmlFor="admin-search-filter" className="sr-only">
          {placeholder}
        </label>
        <div className="relative">
          <span
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            aria-hidden="true"
          >
            🔍
          </span>
          <input
            id="admin-search-filter"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full rounded-xl border border-white/10 bg-[#08101f] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {filters.map((filter) => (
        <div key={filter.key} className="min-w-[160px]">
          <label htmlFor={`filter-${filter.key}`} className="sr-only">
            {filter.label}
          </label>
          <select
            id={`filter-${filter.key}`}
            defaultValue="all"
            onChange={(e) => onFilter?.(filter.key, e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#08101f] px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All {filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
