import { ebooks } from "@/lib/books";
import Link from "next/link";

export default function AdminBooksPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Content
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Book Administration
        </h1>
        <p className="mt-4 text-gray-400">
          Manage the Edunancial book library — publish, edit and track sales.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {[
          { label: "Total Books", value: ebooks.length },
          { label: "Published", value: ebooks.filter((b) => b.published).length },
          { label: "Total Sales", value: "0" },
          { label: "Revenue", value: "$0.00" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-gray-400 text-sm">{label}</p>
            <h2 className="text-4xl font-black mt-2">{value}</h2>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#101a2f] border border-white/10 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-bold">Book Inventory</h2>
          <Link href="/admin/uploads" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-700 transition-colors">
            Add Book
          </Link>
        </div>
        {ebooks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  {["Title", "Author", "Category", "Price", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-400 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ebooks.map((book) => (
                  <tr key={book.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-semibold">{book.title}</td>
                    <td className="px-6 py-4 text-gray-300">{book.author}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
                        book.category === "blue" ? "bg-blue-500/10 text-blue-400" :
                        book.category === "red" ? "bg-red-500/10 text-red-400" :
                        "bg-gray-500/10 text-gray-400"
                      }`}>
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono">${book.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${book.published ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                        {book.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-blue-400 hover:text-blue-300 text-xs font-semibold">Edit</button>
                        <button className="text-gray-400 hover:text-red-400 text-xs font-semibold">Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            No books yet. Upload your first book to get started.
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
        <h2 className="font-bold mb-5">Quick Upload</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <input placeholder="Book Title" className="rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm placeholder:text-gray-500" />
          <input placeholder="Author" className="rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm placeholder:text-gray-500" />
          <input placeholder="Price (USD)" className="rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm placeholder:text-gray-500" />
          <select className="rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm">
            <option>Select Category</option>
            <option>Red (Real Estate)</option>
            <option>White (Paper Assets)</option>
            <option>Blue (Business)</option>
          </select>
        </div>
        <button className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-bold text-sm hover:bg-blue-700 transition-colors">
          Upload Book
        </button>
      </div>

    </main>
  );
}
