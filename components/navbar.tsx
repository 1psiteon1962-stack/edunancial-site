"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow py-4 px-6 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-gray-900">
        Edunancial
      </Link>

      <div className="flex gap-6 text-gray-700">
        <Link href="#books">Books</Link>
        <Link href="#courses">Courses</Link>
        <Link href="#apps">Apps</Link>
        <Link href="#about">About</Link>
      </div>
    </nav>
  );
}
