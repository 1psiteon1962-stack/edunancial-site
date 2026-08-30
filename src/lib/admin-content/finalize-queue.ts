export type FinalizeProgress = {
  completed: number;
  total: number;
  percent: number;
};

/**
 * Finalize packages one request at a time. Each package therefore receives its
 * own serverless execution budget instead of making one request responsible
 * for extracting and normalizing an entire bulk curriculum selection.
 *
 * Intentionally sequential: ZIP extraction is CPU/memory heavy and running
 * several finalizers concurrently can trade a timeout for resource pressure.
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
    results.push(await worker(items[index], index));
    const completed = index + 1;
    onProgress?.({
      completed,
      total: items.length,
      percent: Math.round((completed / items.length) * 100),
    });
  }
  return results;
}
