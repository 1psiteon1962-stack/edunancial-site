"use client";

export default function CheckoutPage() {

  return (

    <main className="min-h-screen bg-[#0a0f1e] text-white flex items-center justify-center">

      <div className="max-w-xl rounded-2xl bg-[#151b2d] p-10 text-center">

        <h1 className="text-5xl font-black">

          Checkout

        </h1>

        <p className="mt-6 text-lg text-gray-300">

          Square payment integration will be connected here.

        </p>

        <button
          className="mt-10 rounded-xl bg-blue-600 px-10 py-4 text-xl font-bold"
        >

          Continue to Square

        </button>

      </div>

    </main>

  );

}
