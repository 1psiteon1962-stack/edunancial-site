import Link from "next/link";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h1 className="text-6xl font-black">
          Edunancial Admin
        </h1>

        <p className="mt-6 text-xl text-gray-300">
          Manage books, terms, courses, downloads, products, and sales data.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/admin/books"
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold hover:bg-blue-700"
          >
            Manage Books
          </Link>

          <Link
            href="/admin/terms"
            className="rounded-xl bg-red-600 px-6 py-3 font-bold hover:bg-red-700"
          >
            Manage Terms
          </Link>

          <Link
            href="/admin/courses"
            className="rounded-xl bg-green-600 px-6 py-3 font-bold hover:bg-green-700"
          >
            Manage Courses
          </Link>
        </div>

        <div className="mt-16">
          <AdminDashboard />
        </div>
      </section>
    </main>
  );
}
