import Link from "next/link";

export default function PaymentCancelledPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white flex items-center justify-center px-6">

      <div className="max-w-2xl text-center">

        <h1 className="text-6xl font-black text-red-500">
          Payment Cancelled
        </h1>

        <p className="mt-8 text-xl text-gray-300">
          Your payment was not completed.
          You may return at any time.
        </p>

        <Link
          href="/books"
          className="inline-block mt-12 rounded-xl bg-red-600 px-8 py-4 font-bold"
        >
          Return To Store
        </Link>

      </div>

    </main>
  );
}
