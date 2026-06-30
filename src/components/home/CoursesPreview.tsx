import Link from "next/link";

export default function CoursesPreview() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-5xl font-black text-white">
          Courses
        </h2>

        <p className="mt-6 text-xl text-gray-300">
          Structured learning in Real Estate, Paper Assets and Business.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">

          <div className="rounded-2xl bg-[#111827] p-8">
            <h3 className="text-3xl font-bold text-red-500">
              RED
            </h3>
            <p className="mt-4 text-gray-300">
              Real Estate investing, tax liens, tax deeds,
              creative financing and commercial property.
            </p>
          </div>

          <div className="rounded-2xl bg-[#111827] p-8">
            <h3 className="text-3xl font-bold">
              WHITE
            </h3>
            <p className="mt-4 text-gray-300">
              Budgeting, investing, stocks, ETFs,
              retirement planning and precious metals.
            </p>
          </div>

          <div className="rounded-2xl bg-[#111827] p-8">
            <h3 className="text-3xl font-bold text-blue-500">
              BLUE
            </h3>
            <p className="mt-4 text-gray-300">
              Entrepreneurship, marketing, pricing,
              KPIs, profit and scaling.
            </p>
          </div>

        </div>

        <div className="mt-12 text-center">

          <Link
            href="/courses"
            className="rounded-xl bg-blue-600 px-8 py-4 text-xl font-bold"
          >
            View All Courses
          </Link>

        </div>

      </div>
    </section>
  );
}
