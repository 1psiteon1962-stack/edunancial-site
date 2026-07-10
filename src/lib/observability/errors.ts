import { logger } from "@/lib/observability/logger";

function normalizeError(error: unknown): { name: string; message: string; stack?: string } {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  if (typeof error === "string") {
    return {
      name: "Error",
      message: error,
    };
  }

  return {
    name: "UnknownError",
    message: "An unknown error occurred",
  };
}

export function logStructuredError(
  error: unknown,
  context: Record<string, unknown> = {}
): void {
  const normalizedError = normalizeError(error);

  logger.error(normalizedError.message, {
    ...context,
    error: normalizedError,
  });
}
