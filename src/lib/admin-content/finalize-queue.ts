export type FinalizeProgress = {
  completed: number;
  total: number;
  percent: number;
};

export type FinalizeFailure<T> = {
  item: T;
  index: number;
  error: unknown;
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
 * Finalize packages one request at a time. A failure belongs to the individual
 * package and must never prevent later packages from being processed.
 *
 * Transient failures are retried first. If retries are exhausted (or the error
 * is permanent), the failed item is reported through onFailure and the queue
 * advances to the next package. Successful results are returned normally.
 */
export async function runSequentialFinalization<T, R>(
  items: readonly T[],
  worker: (item: T, index: number) => Promise<R>,
  onProgress?: (progress: FinalizeProgress) => void,
  onFailure?: (failure: FinalizeFailure<T>) => void,
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
        if (isTransientFinalizeError(error) && retriesRemaining > 0) {
          attempt += 1;
          retriesRemaining -= 1;
          await delay(BASE_RETRY_DELAY_MS * attempt);
          continue;
        }

        onFailure?.({ item: items[index], index, error });
        break;
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
