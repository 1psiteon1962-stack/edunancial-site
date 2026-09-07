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

export type FinalizeOptions = {
  concurrency?: number;
  transientRetries?: number;
};

const DEFAULT_TRANSIENT_RETRIES = 2;
export const DEFAULT_FINALIZE_CONCURRENCY = 4;
const MAX_FINALIZE_CONCURRENCY = 6;
const BASE_RETRY_DELAY_MS = 1200;

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error ?? "");
}

/**
 * A timeout or lost connection after a finalize request was sent is ambiguous:
 * the server may still be publishing the package even though the client never
 * received the response. Retrying immediately can overlap that publication.
 * Leave these packages stored and let interrupted-upload recovery reconcile
 * their audit state before another finalization attempt.
 */
function isAmbiguousFinalizeError(error: unknown): boolean {
  return /HTTP\s+(408|504)\b|network error|failed to fetch|timeout|timed out|connection reset/iu.test(
    errorMessage(error),
  );
}

function isSafeTransientFinalizeError(error: unknown): boolean {
  if (isAmbiguousFinalizeError(error)) return false;
  return /HTTP\s+(425|429|500|502|503)\b|temporarily unavailable/iu.test(
    errorMessage(error),
  );
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function reportFailureSafely<T>(
  onFailure: ((failure: FinalizeFailure<T>) => void) | undefined,
  failure: FinalizeFailure<T>,
): void {
  try {
    onFailure?.(failure);
  } catch {
    // Reporting must never terminate the finalization queue.
  }
}

/**
 * Finalize packages with bounded concurrency. Every package is independent:
 * exhausted retries, ambiguous timeouts, or permanent validation failures are
 * recorded for that package while other packages continue. Successful results
 * are checkpointed by the server endpoint as soon as each request completes.
 */
export async function runParallelFinalization<T, R>(
  items: readonly T[],
  worker: (item: T, index: number) => Promise<R>,
  onProgress?: (progress: FinalizeProgress) => void,
  onFailure?: (failure: FinalizeFailure<T>) => void,
  options: FinalizeOptions = {},
): Promise<R[]> {
  if (items.length === 0) {
    onProgress?.({ completed: 0, total: 0, percent: 100 });
    return [];
  }

  const requestedConcurrency = Math.max(
    1,
    Math.floor(options.concurrency ?? DEFAULT_FINALIZE_CONCURRENCY),
  );
  const concurrency = Math.min(
    MAX_FINALIZE_CONCURRENCY,
    requestedConcurrency,
    items.length,
  );
  const transientRetries = Math.max(
    0,
    Math.floor(options.transientRetries ?? DEFAULT_TRANSIENT_RETRIES),
  );
  const resultsByIndex = new Map<number, R>();
  let firstTerminalError: unknown = null;
  let nextIndex = 0;
  let completed = 0;

  async function runner(): Promise<void> {
    while (true) {
      const index = nextIndex;
      if (index >= items.length) return;
      nextIndex += 1;

      let retriesRemaining = transientRetries;
      let attempt = 0;
      while (true) {
        try {
          resultsByIndex.set(index, await worker(items[index], index));
          break;
        } catch (error) {
          if (isSafeTransientFinalizeError(error) && retriesRemaining > 0) {
            attempt += 1;
            retriesRemaining -= 1;
            await delay(BASE_RETRY_DELAY_MS * attempt);
            continue;
          }

          if (firstTerminalError === null) firstTerminalError = error;
          reportFailureSafely(onFailure, { item: items[index], index, error });
          break;
        }
      }

      completed += 1;
      onProgress?.({
        completed,
        total: items.length,
        percent: Math.round((completed / items.length) * 100),
      });
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => runner()));

  if (resultsByIndex.size === 0 && firstTerminalError !== null) {
    throw firstTerminalError;
  }

  return [...resultsByIndex.entries()]
    .sort(([left], [right]) => left - right)
    .map(([, result]) => result);
}

/**
 * Historical export name retained so the deployed uploader receives the repair
 * without a risky rewrite of the large client component. Bulk finalization is
 * now bounded-parallel even though older callers import this symbol by name.
 */
export async function runSequentialFinalization<T, R>(
  items: readonly T[],
  worker: (item: T, index: number) => Promise<R>,
  onProgress?: (progress: FinalizeProgress) => void,
  onFailure?: (failure: FinalizeFailure<T>) => void,
): Promise<R[]> {
  return runParallelFinalization(items, worker, onProgress, onFailure);
}
