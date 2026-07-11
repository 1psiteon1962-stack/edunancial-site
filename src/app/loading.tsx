export default function Loading() {
  return (
    <main
      className="flex min-h-[70vh] flex-col items-center justify-center bg-[#08101f] px-6 text-center text-white"
      aria-live="polite"
      aria-label="Loading content"
    >
      <div
        className="h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
        role="status"
        aria-hidden="true"
      />
      <p className="mt-6 text-lg font-bold text-slate-300">Loading…</p>
    </main>
  );
}
