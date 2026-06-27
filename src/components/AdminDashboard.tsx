import { ebooks } from "@/lib/books";
import BookInventoryTable from "./BookInventoryTable";

export default function AdminDashboard() {
  return (
    <section className="rounded-3xl bg-[#151b2d] p-10">

      <h2 className="text-4xl font-black">

        Content Dashboard

      </h2>

      <p className="mt-5 text-gray-300">

        Manage books, Financial Term packs,
        downloadable products and future courses
        from one location.

      </p>

      <div className="mt-10">

        <BookInventoryTable
          books={ebooks}
        />

      </div>

    </section>
  );
}
