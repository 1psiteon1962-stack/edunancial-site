/** Owner decision (2026-11-17): every Square API call gives up after 15 seconds. */
export const SQUARE_REQUEST_TIMEOUT_MS = 15_000;

export function squareTimeoutSignal(): AbortSignal {
  return AbortSignal.timeout(SQUARE_REQUEST_TIMEOUT_MS);
}
