/**
 * Standardized JSON response envelopes for all API responses.
 * Ensures consistent structure across v1, v2 and future API versions.
 */

import { NextResponse } from "next/server";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiMeta {
  requestId?: string;
  version?: string;
  timestamp?: string;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SuccessEnvelope<T> {
  success: true;
  data: T;
  meta?: ApiMeta & Partial<PaginationMeta>;
}

export interface ErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: ApiMeta;
}

export type ApiEnvelope<T> = SuccessEnvelope<T> | ErrorEnvelope;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildMeta(extra?: Partial<ApiMeta>): ApiMeta {
  return {
    timestamp: new Date().toISOString(),
    version: "1",
    ...extra,
  };
}

/**
 * Returns a standard success response envelope.
 */
export function success<T>(
  data: T,
  opts: {
    status?: number;
    meta?: ApiMeta & Partial<PaginationMeta>;
    headers?: HeadersInit;
  } = {}
): NextResponse<SuccessEnvelope<T>> {
  const body: SuccessEnvelope<T> = {
    success: true,
    data,
    meta: { ...buildMeta(opts.meta), ...opts.meta },
  };
  return NextResponse.json(body, {
    status: opts.status ?? 200,
    headers: opts.headers,
  });
}

/**
 * Returns a standard error response envelope.
 */
export function apiError(
  code: string,
  message: string,
  opts: {
    status?: number;
    details?: unknown;
    meta?: ApiMeta;
    headers?: HeadersInit;
  } = {}
): NextResponse<ErrorEnvelope> {
  const body: ErrorEnvelope = {
    success: false,
    error: { code, message, details: opts.details },
    meta: buildMeta(opts.meta),
  };
  return NextResponse.json(body, {
    status: opts.status ?? 400,
    headers: opts.headers,
  });
}

/**
 * Build a paginated success response including pagination meta.
 */
export function paginated<T>(
  items: T[],
  pagination: PaginationMeta,
  opts: { status?: number; meta?: ApiMeta } = {}
): NextResponse<SuccessEnvelope<T[]>> {
  return success(items, {
    status: opts.status,
    meta: { ...buildMeta(opts.meta), ...pagination },
  });
}
