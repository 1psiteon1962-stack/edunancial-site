// components/sections/FooterSection.tsx
import Link from "next/link";

export default function FooterSection() {
  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2 space-y-2">
            <h4 className="text-lg font-bold text-white">Edunancial</h4>
            <p className="text-sm text-slate-300">
              A financial education company empowering new generations through
              accessible, bilingual wealth-building resources.
            </p>
            <p className="text-[11px] text-slate-400">
              Based in West Palm Beach, Florida. | West Palm Beach, Florida.
            </p>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-white">Learn</h5>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link href="#courses" className="hover:text-yellow-300">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="#apps" className="hover:text-yellow-300">
                  EduMath &amp; Edunancial Edge
                </Link>
              </li>
              <li>
                <Link href="#books" className="hover:text-yellow-300">
                  Books
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-white">Legal</h5>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <span className="cursor-default text-slate-400">
                  Privacy Notice (coming soon)
                </span>
              </li>
              <li>
                <span className="cursor-default text-slate-400">
                  Terms of Use (coming soon)
                </span>
              </li>
            </ul>
            <div className="mt-4 text-[11px] text-slate-500">
              © {new Date().getFullYear()} Edunancial, Inc. All rights
              reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
