"use client";

import Link from "next/link";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Courses", href: "/courses" },
  { name: "AI Coach", href: "/ai-coach" },
  { name: "Pricing", href: "/pricing" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
  { name: "Log In", href: "/login" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#08101f]/95 backdrop-blur">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        <Link href="/" className="text-3xl font-black">

          <span className="text-red-500">RED</span>

          <span className="text-white">.</span>

          <span className="text-white">WHITE</span>

          <span className="text-white">.</span>

          <span className="text-blue-500">BLUE</span>

        </Link>

        <nav className="hidden gap-8 lg:flex">

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

        <Link
          href="/membership"
          className="rounded-lg bg-blue-600 px-5 py-3 font-bold"
        >
          Become a Member
        </Link>

      </div>

    </header>
  );
}
