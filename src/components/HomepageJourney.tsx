import Link from "next/link";

export default function HomepageJourney() {
  return (
    <section className="bg-[#050816] text-white py-24 px-6">

      <div className="max-w-7xl mx-auto">

        <h2 className="text-5xl md:text-6xl font-black text-center">

          Begin Your Journey

        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-20">

          <Link
            href="/terms"
            className="rounded-2xl bg-[#151b2d] p-10 hover:bg-[#1d2640]"
          >

            <h3 className="text-3xl font-black text-blue-500">

              Learn Terms

            </h3>

            <p className="mt-6 text-gray-300">

              Build your vocabulary of wealth one financial concept at a time.

            </p>

          </Link>

          <Link
            href="/marketplace"
            className="rounded-2xl bg-[#151b2d] p-10 hover:bg-[#1d2640]"
          >

            <h3 className="text-3xl font-black text-red-500">

              Browse Marketplace

            </h3>

            <p className="mt-6 text-gray-300">

              Practical knowledge you can begin using immediately.

            </p>

          </Link>

          <Link
            href="/courses"
            className="rounded-2xl bg-[#151b2d] p-10 hover:bg-[#1d2640]"
          >

            <h3 className="text-3xl font-black">

              Take Courses

            </h3>

            <p className="mt-6 text-gray-300">

              Structured learning designed to help you build wealth.

            </p>

          </Link>

        </div>

      </div>

    </section>
  );
}
