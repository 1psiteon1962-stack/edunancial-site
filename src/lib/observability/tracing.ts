export const REQUEST_ID_HEADER = "x-request-id";
export const CORRELATION_ID_HEADER = "x-correlation-id";

function fallbackRequestId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function generateRequestId(): string {
  return globalThis.crypto?.randomUUID?.() ?? fallbackRequestId();
}

export function getRequestId(headers: Headers): string {
  return (
    headers.get(REQUEST_ID_HEADER) ?? headers.get(CORRELATION_ID_HEADER) ?? generateRequestId()
  );
}

export function attachRequestHeaders(response: Response, requestId: string): Response {
  response.headers.set(REQUEST_ID_HEADER, requestId);
  response.headers.set(CORRELATION_ID_HEADER, requestId);
  return response;
}

export function getRequestContext(request: Request, requestId?: string): Record<string, unknown> {
  const url = new URL(request.url);

  return {
    requestId: requestId ?? getRequestId(request.headers),
    method: request.method,
    path: url.pathname,
    userAgent: request.headers.get("user-agent") ?? "unknown",
  };
}
