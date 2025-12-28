'use client';

import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="text-xl font-semibold">
          <Link href="/">Edunancial</Link>
        </div>

        <div className="flex gap-6 text-sm font-medium">
          <Link href="/us">US</Link>
          <Link href="/latam">LATAM</Link>
          <Link href="/africa">Africa</Link>
          <Link href="/conclusions">Conclusions</Link>
        </div>
      </div>
    </nav>
  );
}
