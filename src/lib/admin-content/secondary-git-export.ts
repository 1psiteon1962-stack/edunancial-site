/**
 * Git export is secondary to a verified, durable learner publication receipt.
 * A queue outage must not retroactively fail the published upload.
 */
export async function enqueueExportWithoutInvalidatingPublication(
  enqueue: () => Promise<unknown>,
  onError: (error: unknown) => void,
): Promise<boolean> {
  try {
    await enqueue();
    return true;
  } catch (error) {
    onError(error);
    return false;
  }
}
