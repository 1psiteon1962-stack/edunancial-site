"use client";

import Link from "next/link";

const books = [
  {
    title: "RED — Real Estate",
    description: "Real estate investing, creative financing, tax liens, tax deeds and commercial property.",
    price: "Coming Soon",
    href: "/books/red",
    color: "text-red-500"
  },
  {
    title: "WHITE — Paper Assets",
    description: "Budgeting, stocks, ETFs, options, precious metals and investing.",
    price: "Coming Soon",
    href: "/books/white",
    color: "text-white"
  },
  {
    title: "BLUE — Business",
    description: "Entrepreneurship, KPIs, marketing, pricing, profit and scaling.",
    price: "Coming Soon",
    href: "/books/blue",
    color: "text-blue-500"
  },
  {
    title: "AI for Entrepreneurs",
    description: "Using artificial intelligence to grow and automate your business.",
    price: "Coming Soon",
    href: "/books/ai"
  },
  {
    title: "Business Is About Making Profit",
    description: "Know your numbers. Build profitable businesses.",
    price: "Coming Soon",
    href: "/books/profit"
  },
  {
    title: "Creative Real Estate Financing",
    description: "Multiple strategies for acquiring property with limited capital.",
    price: "Coming Soon",
    href: "/books/creative-financing"
  }
];

export default function BooksLibrary() {
  return (
    <section className="py-24 bg-[#08101f]">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-black mb-4">
          Books Library
        </h2>

        <p className="text-gray-400 mb-12 text-xl">
          Build wealth through the Red, White and Blue framework.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {books.map((book) => (

            <div
              key={book.title}
              className="rounded-2xl border border-slate-700 bg-[#101827] p-8"
            >

              <div className="h-56 rounded-xl bg-slate-800 flex items-center justify-center mb-6">
                <span className="text-gray-500">
                  Book Cover
                </span>
              </div>

              <h3 className={`text-2xl font-bold mb-3 ${book.color ?? ""}`}>
                {book.title}
              </h3>

              <p className="text-gray-400 mb-6">
                {book.description}
              </p>

              <p className="font-semibold mb-6">
                {book.price}
              </p>

              <Link
                href={book.href}
                className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-bold hover:bg-blue-700"
              >
                View Book
              </Link>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}
