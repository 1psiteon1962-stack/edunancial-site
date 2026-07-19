import Link from "next/link";

export default function CTAButtons() {

  return (

    <div className="flex flex-wrap justify-center gap-6 mt-12">

      <Link
        href="/marketplace"
        className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-blue-500"
      >
        Explore Marketplace
      </Link>

      <Link
        href="/courses"
        className="rounded-xl border border-white/30 px-8 py-4 text-lg font-bold text-white transition hover:bg-white hover:text-black"
      >
        Browse Courses
      </Link>

      <Link
        href="/terms"
        className="rounded-xl border border-blue-500 px-8 py-4 text-lg font-bold text-blue-400 transition hover:bg-blue-600 hover:text-white"
      >
        Financial Terms
      </Link>

    </div>

  );

}
