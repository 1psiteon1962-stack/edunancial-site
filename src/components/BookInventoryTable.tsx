"use client";

import { Ebook } from "@/lib/bookTypes";

interface Props {
  books: Ebook[];
}

export default function BookInventoryTable({
  books,
}: Props) {
  return (
    <table className="w-full rounded-2xl overflow-hidden">

      <thead className="bg-[#1b2438]">

        <tr>

          <th className="p-4 text-left">
            Title
          </th>

          <th className="p-4 text-left">
            Category
          </th>

          <th className="p-4 text-left">
            Price
          </th>

          <th className="p-4 text-left">
            Status
          </th>

        </tr>

      </thead>

      <tbody>

        {books.map(book => (

          <tr
            key={book.id}
            className="border-b border-gray-800"
          >

            <td className="p-4">
              {book.title}
            </td>

            <td className="p-4">
              {book.category}
            </td>

            <td className="p-4">
              ${book.price.toFixed(2)}
            </td>

            <td className="p-4">

              {book.published
                ? "Published"
                : "Draft"}

            </td>

          </tr>

        ))}

      </tbody>

    </table>
  );
}
