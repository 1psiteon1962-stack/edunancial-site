export const DEFAULT_UPLOAD_CONCURRENCY = 4;

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

/**
 * Run browser upload jobs with bounded concurrency. Individual package failures
 * are isolated so a bad file cannot abort the remaining 50-500 package batch.
 */
export async function runParallelUploads<T>(
  items: readonly T[],
  worker: (item: T, index: number, reportLoadedBytes: (loadedBytes: number) => void) => Promise<void>,
  options: {
    concurrency?: number;
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

      try {
        await worker(item, index, (loadedBytes) => {
          loaded[index] = Math.max(0, Math.min(size, loadedBytes));
          publishProgress();
        });
        loaded[index] = size;
      } catch (error) {
        loaded[index] = size;
        const failure: UploadFailure<T> = { item, index, error };
        failures.push(failure);
        options.onFailure?.(failure);
      }

      publishProgress();
    }
  };

  await Promise.all(Array.from({ length: concurrency }, () => runner()));
  return failures.sort((a, b) => a.index - b.index);
}
