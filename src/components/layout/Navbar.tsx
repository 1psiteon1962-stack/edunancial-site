"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Assessment", href: "/assessment" },
  { name: "Membership", href: "/membership" },
  { name: "Passport", href: "/passport" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "Family", href: "/family" },
  { name: "Our Story", href: "/why-edunancial" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#08101f]/95 backdrop-blur">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        <Link href="/" className="text-3xl font-black" aria-label="Edunancial home">
          <span className="text-red-500">RED</span>
          <span className="text-white">.</span>
          <span className="text-white">WHITE</span>
          <span className="text-white">.</span>
          <span className="text-blue-500">BLUE</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden gap-8 lg:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-slate-300 hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/assessment"
            className="hidden rounded-lg bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700 lg:inline-flex"
          >
            Start Assessment
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-white hover:bg-slate-800 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              // X icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          className="border-t border-slate-800 bg-[#08101f] px-6 pb-6 pt-4 lg:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Link
              href="/assessment"
              className="block w-full rounded-xl bg-blue-600 px-5 py-4 text-center font-bold hover:bg-blue-700"
              onClick={() => setMobileOpen(false)}
            >
              Start Assessment
            </Link>
          </div>
        </nav>
      )}

    </header>
  );
}
