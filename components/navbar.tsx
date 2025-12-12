"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Edunancial
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-lg font-medium">
          <Link href="#books" className="hover:text-blue-500">Books</Link>
          <Link href="#courses" className="hover:text-blue-500">Courses</Link>
          <Link href="#apps" className="hover:text-blue-500">Apps</Link>
          <Link href="#story" className="hover:text-blue-500">Our Story</Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden flex flex-col bg-white shadow-lg p-4 gap-4 text-lg">
          <Link href="#books" onClick={() => setOpen(false)}>Books</Link>
          <Link href="#courses" onClick={() => setOpen(false)}>Courses</Link>
          <Link href="#apps" onClick={() => setOpen(false)}>Apps</Link>
          <Link href="#story" onClick={() => setOpen(false)}>Our Story</Link>
        </div>
      )}
    </nav>
  );
}
