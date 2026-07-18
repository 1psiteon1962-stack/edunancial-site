"use client";

export default function RegionalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-white">
      <h2 className="text-4xl font-black">Regional architecture error</h2>
      <p className="mt-6 text-lg text-slate-300">
        A region-scoped page failed to load. Existing shared functionality is
        unchanged.
      </p>
      {error.digest ? (
        <p className="mt-4 text-sm text-slate-400">Reference: {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="mt-8 rounded-lg bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700"
      >
        Retry
      </button>
    </section>
  );
}
