export type FinalizeProgress = {
  completed: number;
  total: number;
  percent: number;
};

const DEFAULT_TRANSIENT_RETRIES = 2;
const BASE_RETRY_DELAY_MS = 1200;

function isTransientFinalizeError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /HTTP\s+(408|425|429|500|502|503|504)\b|network error|failed to fetch|timeout|timed out|connection reset|temporarily unavailable/iu.test(message);
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Finalize packages one request at a time. Each package therefore receives its
 * own serverless execution budget instead of making one request responsible
 * for extracting and normalizing an entire bulk curriculum selection.
 *
 * Intentionally sequential: ZIP extraction is CPU/memory heavy and running
 * several finalizers concurrently can trade a timeout for resource pressure.
 *
 * Transient gateway/network failures are retried against the same already-
 * uploaded storage object. This avoids forcing the owner to upload large ZIPs
 * again when the storage transfer succeeded but the serverless finalizer was
 * interrupted. The server-side finalizer is idempotency-aware and skips an
 * upload that already recorded a successful FINALIZE operation.
 */
export async function runSequentialFinalization<T, R>(
  items: readonly T[],
  worker: (item: T, index: number) => Promise<R>,
  onProgress?: (progress: FinalizeProgress) => void,
): Promise<R[]> {
  const results: R[] = [];
  if (items.length === 0) {
    onProgress?.({ completed: 0, total: 0, percent: 100 });
    return results;
  }

  for (let index = 0; index < items.length; index += 1) {
    let retriesRemaining = DEFAULT_TRANSIENT_RETRIES;
    let attempt = 0;

    while (true) {
      try {
        results.push(await worker(items[index], index));
        break;
      } catch (error) {
        if (!isTransientFinalizeError(error) || retriesRemaining <= 0) throw error;
        attempt += 1;
        retriesRemaining -= 1;
        await delay(BASE_RETRY_DELAY_MS * attempt);
      }
    }

    const completed = index + 1;
    onProgress?.({
      completed,
      total: items.length,
      percent: Math.round((completed / items.length) * 100),
    });
  }
  return results;
}
