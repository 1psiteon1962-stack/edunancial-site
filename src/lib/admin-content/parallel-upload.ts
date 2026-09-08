export const DEFAULT_UPLOAD_CONCURRENCY = 4;
export const DEFAULT_UPLOAD_RETRIES = 2;
const BASE_UPLOAD_RETRY_DELAY_MS = 750;

export type UploadProgress = {
  completedBytes: number;
  totalBytes: number;
  percent: number;
};

export type UploadFailure<T> = {
  item: T;
  index: number;
  error: unknown;
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Run browser upload jobs with bounded concurrency. Individual package failures
 * are isolated so a bad file cannot abort the remaining 50-500 package batch.
 * A storage transfer that fails is retried in-place before it is declared
 * terminal. This is safe because the signed destination identifies the same
 * stored object; unlike server-side finalization, a retry cannot create a
 * second curriculum publication operation.
 */
export async function runParallelUploads<T>(
  items: readonly T[],
  worker: (item: T, index: number, reportLoadedBytes: (loadedBytes: number) => void) => Promise<void>,
  options: {
    concurrency?: number;
    retries?: number;
    sizeOf: (item: T) => number;
    onProgress?: (progress: UploadProgress) => void;
    onFailure?: (failure: UploadFailure<T>) => void;
  },
): Promise<UploadFailure<T>[]> {
  if (items.length === 0) {
    options.onProgress?.({ completedBytes: 0, totalBytes: 0, percent: 100 });
    return [];
  }

  const concurrency = Math.max(
    1,
    Math.min(Math.floor(options.concurrency ?? DEFAULT_UPLOAD_CONCURRENCY), items.length),
  );
  const retries = Math.max(0, Math.floor(options.retries ?? DEFAULT_UPLOAD_RETRIES));
  const sizes = items.map((item) => Math.max(0, options.sizeOf(item)));
  const loaded = new Array<number>(items.length).fill(0);
  const totalBytes = sizes.reduce((sum, size) => sum + size, 0);
  const failures: UploadFailure<T>[] = [];
  let cursor = 0;

  const publishProgress = () => {
    const completedBytes = loaded.reduce((sum, value) => sum + value, 0);
    const percent = totalBytes > 0 ? Math.min(100, Math.round((completedBytes / totalBytes) * 100)) : 100;
    options.onProgress?.({ completedBytes, totalBytes, percent });
  };

  const runner = async () => {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      const item = items[index];
      const size = sizes[index];
      let terminalError: unknown = null;

      for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
          if (attempt > 0) {
            loaded[index] = 0;
            publishProgress();
            await delay(BASE_UPLOAD_RETRY_DELAY_MS * attempt);
          }
          await worker(item, index, (loadedBytes) => {
            loaded[index] = Math.max(0, Math.min(size, loadedBytes));
            publishProgress();
          });
          loaded[index] = size;
          terminalError = null;
          break;
        } catch (error) {
          terminalError = error;
        }
      }

      if (terminalError !== null) {
        loaded[index] = size;
        const failure: UploadFailure<T> = { item, index, error: terminalError };
        failures.push(failure);
        try {
          options.onFailure?.(failure);
        } catch {
          // Reporting must never terminate the remaining bulk upload.
        }
      }

      publishProgress();
    }
  };

  await Promise.all(Array.from({ length: concurrency }, () => runner()));
  return failures.sort((a, b) => a.index - b.index);
}
