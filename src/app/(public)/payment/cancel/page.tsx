import Link from "next/link";

export default function PaymentCancelledPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <div className="text-7xl mb-4" aria-hidden="true">
          ↩
        </div>

        <h1 className="text-5xl font-black text-slate-200">
          Payment Cancelled
        </h1>

        <p className="mt-6 text-lg text-gray-300">
          Your payment was not completed and no charge has been made.
          You can return to membership options whenever you are ready.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/membership"
            className="rounded-xl bg-blue-600 px-8 py-4 font-bold hover:bg-blue-500"
          >
            View Membership Options
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-white/20 px-8 py-4 font-bold hover:border-white/40"
          >
            Return Home
          </Link>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          Have questions?{" "}
          <Link href="/contact" className="text-blue-400 hover:text-blue-300">
            Contact support
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
