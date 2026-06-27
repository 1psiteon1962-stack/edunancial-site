import Link from "next/link";

export default function UserLibrary() {
  return (
    <section className="rounded-2xl bg-[#151b2d] p-8">

      <h2 className="text-4xl font-black">
        My Library
      </h2>

      <p className="mt-5 text-gray-300">
        All purchased books, Financial Term Packs,
        worksheets, and future courses appear here.
      </p>

      <div className="mt-10 grid gap-4">

        <Link
          href="/downloads"
          className="rounded-xl bg-blue-600 px-6 py-4 font-bold text-center"
        >
          My Downloads
        </Link>

        <Link
          href="/terms"
          className="rounded-xl bg-red-600 px-6 py-4 font-bold text-center"
        >
          Financial Terms
        </Link>

        <Link
          href="/courses"
          className="rounded-xl bg-green-600 px-6 py-4 font-bold text-center"
        >
          My Courses
        </Link>

      </div>

    </section>
  );
}
