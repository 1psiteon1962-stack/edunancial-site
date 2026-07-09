"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/authContext";

const navigation = [
  { name: "Courses", href: "/courses" },
  { name: "Assessment", href: "/assessment" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "Books", href: "/books" },
  { name: "Membership", href: "/membership" },
];

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#08101f]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-black shrink-0">
          <span className="text-red-500">RED</span>
          <span className="text-white">.</span>
          <span className="text-white">WHITE</span>
          <span className="text-white">.</span>
          <span className="text-blue-500">BLUE</span>
        </Link>

        <nav className="hidden gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold hover:border-white transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold hover:border-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    Join Free
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        <button
          className="lg:hidden rounded p-2 text-slate-300 hover:text-white"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="block h-0.5 w-6 bg-current mb-1"></span>
          <span className="block h-0.5 w-6 bg-current mb-1"></span>
          <span className="block h-0.5 w-6 bg-current"></span>
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#08101f] px-6 py-4">
          <nav className="flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-slate-300 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <hr className="border-slate-700" />
            {user ? (
              <>
                <Link href="/dashboard" className="font-semibold" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="text-left text-slate-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="font-semibold" onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/register" className="font-semibold text-blue-400" onClick={() => setMenuOpen(false)}>
                  Join Free
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
