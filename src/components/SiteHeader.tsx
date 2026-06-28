import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08101f]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-2xl font-black tracking-[0.18em]">
          EDUNANCIAL
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-300 md:flex">
          <Link href="/books" className="hover:text-white">Books</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
          <Link href="/courses" className="hover:text-white">Courses</Link>
          <Link href="/membership" className="hover:text-white">Membership</Link>
          <Link href="/downloads" className="hover:text-white">Downloads</Link>
        </nav>

        <Link
          href="/account"
          className="rounded-xl border border-white/30 px-5 py-3 text-sm font-bold hover:bg-white hover:text-black"
        >
          Account
        </Link>
      </div>
    </header>
  );
}
