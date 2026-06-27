import Link from "next/link";

export default function LoginRequired() {

  return (

    <div className="rounded-2xl bg-[#151b2d] p-10 text-center">

      <h2 className="text-3xl font-black">

        Login Required

      </h2>

      <p className="mt-6 text-gray-300">

        Please sign in to access your purchased
        books, courses and downloads.

      </p>

      <Link
        href="/login"
        className="inline-block mt-10 rounded-xl bg-blue-600 px-8 py-4 font-bold"
      >

        Sign In

      </Link>

    </div>

  );

}
