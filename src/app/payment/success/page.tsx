import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white flex items-center justify-center px-6">

      <div className="max-w-2xl text-center">

        <h1 className="text-6xl font-black text-green-500">
          Payment Received
        </h1>

        <p className="mt-8 text-xl text-gray-300">
          Thank you. Access remains pending until Edunancial confirms payment on the
          server and applies the correct membership or purchase records.
        </p>

        <Link
          href="/dashboard"
          className="inline-block mt-12 rounded-xl bg-blue-600 px-8 py-4 font-bold"
        >
          Go To My Dashboard
        </Link>

      </div>

    </main>
  );
}
