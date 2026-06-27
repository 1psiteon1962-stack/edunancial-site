import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">

      <section className="max-w-7xl mx-auto px-6 py-20 text-center">

        <p className="uppercase tracking-[8px] text-gray-400 mb-8">
          Financial Literacy For Ordinary People
        </p>

        <h1 className="text-6xl md:text-8xl font-black leading-none">

          <span className="text-red-500">RED.</span>

          <br />

          <span className="text-white">WHITE.</span>

          <br />

          <span className="text-blue-500">BLUE.</span>

        </h1>

        <div className="flex mt-10 h-2 rounded-full overflow-hidden">

          <div className="w-1/3 bg-red-500"></div>

          <div className="w-1/3 bg-white"></div>

          <div className="w-1/3 bg-blue-500"></div>

        </div>

        <p className="mt-10 text-3xl text-gray-300">

          Real Estate. Paper Assets. Business.

        </p>

        <p className="mt-3 text-2xl text-gray-400">

          Three pillars. One mission — Economic Self Defense.

        </p>

        <div className="mt-14 flex flex-col md:flex-row gap-5 justify-center">

          <Link
            href="/books"
            className="bg-red-600 px-8 py-4 rounded-xl font-bold"
          >
            Books
          </Link>

          <Link
            href="/courses"
            className="bg-blue-600 px-8 py-4 rounded-xl font-bold"
          >
            Courses
          </Link>

          <Link
            href="/terms"
            className="bg-white text-black px-8 py-4 rounded-xl font-bold"
          >
            Financial Terms
          </Link>

        </div>

      </section>

    </main>
  );
}
