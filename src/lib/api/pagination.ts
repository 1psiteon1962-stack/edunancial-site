/**
 * Pagination, filtering and sorting utilities.
 * Parse query params into standardised options and build pagination meta.
 */

import type { PaginationMeta } from "./response";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaginationOptions {
  page: number;
  perPage: number;
  offset: number;
}

export interface SortOption {
  field: string;
  direction: "asc" | "desc";
}

export interface FilterOptions {
  [key: string]: string | string[] | undefined;
}

export interface QueryOptions {
  pagination: PaginationOptions;
  sort: SortOption[];
  filters: FilterOptions;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 20;
const MAX_PER_PAGE = 100;

// ─── Parsers ──────────────────────────────────────────────────────────────────

/**
 * Parse pagination query params from a URL.
 * Accepts `page` and `per_page` (or `limit`).
 */
export function parsePagination(url: URL): PaginationOptions {
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || DEFAULT_PAGE);
  const rawPerPage = parseInt(
    url.searchParams.get("per_page") ?? url.searchParams.get("limit") ?? String(DEFAULT_PER_PAGE),
    10
  );
  const perPage = Math.min(Math.max(1, rawPerPage || DEFAULT_PER_PAGE), MAX_PER_PAGE);
  return { page, perPage, offset: (page - 1) * perPage };
}

/**
 * Parse sort query params.
 * Accepts `sort=field:asc,other:desc` or `sort=field` (defaults to asc).
 * Also accepts `sort_by` and `order` as separate params.
 */
export function parseSorting(url: URL, allowedFields: string[]): SortOption[] {
  const sortParam = url.searchParams.get("sort") ?? url.searchParams.get("sort_by");
  if (!sortParam) return [];

  const allowed = new Set(allowedFields);
  return sortParam
    .split(",")
    .map((part) => {
      const [raw, dir] = part.trim().split(":");
      const field = raw.trim();
      const direction: "asc" | "desc" =
        dir?.toLowerCase() === "desc" ? "desc" : "asc";
      return { field, direction };
    })
    .filter(({ field }) => allowed.has(field));
}

/**
 * Parse arbitrary filter params from URL.
 * Prefixed params (filter[field]=value) are also supported.
 */
export function parseFilters(
  url: URL,
  allowedFields: string[]
): FilterOptions {
  const allowed = new Set(allowedFields);
  const filters: FilterOptions = {};

  for (const [key, value] of url.searchParams.entries()) {
    // Support filter[field]=value style
    const match = key.match(/^filter\[(.+)\]$/);
    const field = match ? match[1] : key;
    if (allowed.has(field)) {
      const existing = filters[field];
      if (existing === undefined) {
        filters[field] = value;
      } else if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        filters[field] = [existing, value];
      }
    }
  }

  return filters;
}

/**
 * Build PaginationMeta from options and a total count.
 */
export function buildPaginationMeta(
  opts: PaginationOptions,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / opts.perPage);
  return {
    page: opts.page,
    perPage: opts.perPage,
    total,
    totalPages,
    hasNext: opts.page < totalPages,
    hasPrev: opts.page > 1,
  };
}

/**
 * Convenience: parse all query options from a Request URL.
 */
export function parseQueryOptions(
  request: Request,
  config: { allowedSortFields?: string[]; allowedFilterFields?: string[] } = {}
): QueryOptions {
  const url = new URL(request.url);
  return {
    pagination: parsePagination(url),
    sort: parseSorting(url, config.allowedSortFields ?? []),
    filters: parseFilters(url, config.allowedFilterFields ?? []),
  };
}
