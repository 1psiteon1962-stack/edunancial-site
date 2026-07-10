/**
 * Centralized API error types and a handler for consistent error responses.
 */

import { NextResponse } from "next/server";
import { apiError, type ErrorEnvelope } from "./response";

// ─── Error codes ──────────────────────────────────────────────────────────────

export const ApiErrorCode = {
  BAD_REQUEST: "BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  UNPROCESSABLE: "UNPROCESSABLE_ENTITY",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL: "INTERNAL_ERROR",
  VALIDATION: "VALIDATION_ERROR",
  INVALID_SIGNATURE: "INVALID_SIGNATURE",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_REVOKED: "TOKEN_REVOKED",
  REPLAY_DETECTED: "REPLAY_DETECTED",
} as const;

export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

// ─── ApiError class ───────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    message: string,
    public readonly status: number = 400,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }

  static unauthorized(message = "Unauthorized"): ApiError {
    return new ApiError(ApiErrorCode.UNAUTHORIZED, message, 401);
  }

  static forbidden(message = "Forbidden"): ApiError {
    return new ApiError(ApiErrorCode.FORBIDDEN, message, 403);
  }

  static notFound(message = "Not found"): ApiError {
    return new ApiError(ApiErrorCode.NOT_FOUND, message, 404);
  }

  static rateLimited(message = "Rate limit exceeded"): ApiError {
    return new ApiError(ApiErrorCode.RATE_LIMITED, message, 429);
  }

  static validation(
    message: string,
    details?: unknown
  ): ApiError {
    return new ApiError(ApiErrorCode.VALIDATION, message, 422, details);
  }

  static internal(message = "Internal server error"): ApiError {
    return new ApiError(ApiErrorCode.INTERNAL, message, 500);
  }
}

// ─── Global error handler ─────────────────────────────────────────────────────

/**
 * Converts any thrown value into a standard error envelope response.
 * Use inside route handlers: `return handleError(err)`.
 */
export function handleError(
  err: unknown
): NextResponse<ErrorEnvelope> {
  if (err instanceof ApiError) {
    return apiError(err.code, err.message, {
      status: err.status,
      details: err.details,
    });
  }

  const message =
    err instanceof Error ? err.message : "An unexpected error occurred";

  console.error("[API] Unhandled error:", err);

  return apiError(ApiErrorCode.INTERNAL, message, { status: 500 });
}
