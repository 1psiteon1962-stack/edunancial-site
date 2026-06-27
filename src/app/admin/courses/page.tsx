import Link from "next/link";

export default function AdminCoursesPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-20">

        <h1 className="text-6xl font-black">
          Course Administration
        </h1>

        <p className="mt-6 text-xl text-gray-300">
          Create and manage courses, lessons, quizzes, downloads and certificates.
        </p>

        <div className="grid lg:grid-cols-3 gap-8 mt-16">

          <div className="rounded-3xl bg-[#151b2d] p-8">

            <h2 className="text-3xl font-black">
              Lessons
            </h2>

            <p className="mt-5 text-gray-300">
              Organize lessons into structured learning paths.
            </p>

          </div>

          <div className="rounded-3xl bg-[#151b2d] p-8">

            <h2 className="text-3xl font-black">
              Quizzes
            </h2>

            <p className="mt-5 text-gray-300">
              Create quizzes and track student progress.
            </p>

          </div>

          <div className="rounded-3xl bg-[#151b2d] p-8">

            <h2 className="text-3xl font-black">
              Certificates
            </h2>

            <p className="mt-5 text-gray-300">
              Automatically issue certificates when students complete courses.
            </p>

          </div>

        </div>

        <div className="mt-16">

          <Link
            href="/courses"
            className="rounded-xl bg-blue-600 px-8 py-4 font-bold"
          >
            View Live Courses
          </Link>

        </div>

      </section>

    </main>
  );
}
