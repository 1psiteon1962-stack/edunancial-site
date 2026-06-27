"use client";

import Link from "next/link";
import { Ebook } from "@/lib/bookTypes";
import SquareBuyButton from "./SquareBuyButton";

interface Props {
  book: Ebook;
}

export default function EbookCard({ book }: Props) {
  const ribbon = {
    red: "bg-red-600",
    white: "bg-gray-200 text-black",
    blue: "bg-blue-600",
  };

  return (
    <article className="overflow-hidden rounded-3xl bg-[#131b2d] shadow-2xl hover:scale-[1.02] transition-all duration-300">

      <div className="relative">

        <img
          src={book.coverImage}
          alt={book.title}
          className="h-[420px] w-full object-cover"
        />

        <div
          className={`absolute left-5 top-5 rounded-full px-4 py-2 text-sm font-bold ${ribbon[book.category]}`}
        >
          {book.category.toUpperCase()}
        </div>

      </div>

      <div className="p-8">

        <h2 className="text-3xl font-black">
          {book.title}
        </h2>

        <p className="mt-2 text-gray-400">
          {book.author}
        </p>

        <p className="mt-6 leading-8 text-gray-300">
          {book.description}
        </p>

        <div className="mt-8 flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Price
            </p>

            <p className="text-4xl font-black">
              ${book.price.toFixed(2)}
            </p>

          </div>

          <SquareBuyButton
            checkoutUrl={book.squareCheckoutUrl}
            label="Buy Now"
          />

        </div>

        <Link
          href={`/books/${book.id}`}
          className="mt-6 block text-center rounded-xl border border-white py-3 font-bold hover:bg-white hover:text-black"
        >
          View Details
        </Link>

      </div>

    </article>
  );
}
