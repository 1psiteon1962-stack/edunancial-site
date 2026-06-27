"use client";

import Link from "next/link";

export default function Navbar() {
return (
<nav className="sticky top-0 z-50 bg-[#050816]/95 backdrop-blur border-b border-gray-800">

  <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

    <Link href="/" className="text-2xl font-black text-white">
      EDUNANCIAL
    </Link>

    <div className="flex gap-6 text-sm font-semibold">

      <Link href="/">Home</Link>

      <Link href="/books">Books</Link>

      <Link href="/courses">Courses</Link>

      <Link href="/terms">Terms</Link>

      <Link href="/membership">Membership</Link>

      <Link href="/downloads">Downloads</Link>

    </div>

  </div>

</nav>

);
}
