"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#08101f] px-6 text-white">
        <main className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-950/80 p-10 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-300">
            Something went wrong
          </p>
          <h1 className="mt-4 text-4xl font-black">We hit an unexpected error.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Please retry the action. If the issue continues, contact support so
            the team can investigate the request path and deployment logs.
          </p>
          {error.digest ? (
            <p className="mt-4 text-sm text-slate-400">Reference: {error.digest}</p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            className="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
