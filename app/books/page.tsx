"use client";

import React from "react";
import BooksSection from "@/components/sections/bookssection";

export default function BooksPage() {
  return (
    <main className="w-full min-h-screen bg-white text-black flex flex-col items-center">
      <div className="w-full max-w-6xl py-12 px-6">
        <h1 className="text-4xl font-bold mb-6">Books</h1>
        <p className="text-lg mb-10">
          Explore our full library of Edunancial books. Each title includes English, Spanish, and audiobook formats.
        </p>

        <BooksSection />

        <div className="mt-16 text-center text-gray-600">
          More books coming soon.
        </div>
      </div>
    </main>
  );
}
