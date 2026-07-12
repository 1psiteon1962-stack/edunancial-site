import Link from "next/link";
import {
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_PUBLIC_DISCLAIMER,
} from "@/lib/positioning";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#050b17]">
      <div className="mx-auto max-w-7xl px-6 py-20">

        <h2 className="text-4xl font-black">
          {EDUNANCIAL_IDENTITY}
        </h2>
        <h3 className="mt-5 text-3xl font-bold text-blue-400">
          Financial competency is built through disciplined action.
        </h3>

        <div className="mt-16 grid gap-10 md:grid-cols-5">

          <div>
            <h4 className="font-bold text-white">Learn</h4>
            <div className="mt-5 space-y-3 text-slate-400">
              <div><Link href="/courses/red" className="hover:text-white">RED — Real Estate</Link></div>
              <div><Link href="/courses/white" className="hover:text-white">WHITE — Paper Assets</Link></div>
              <div><Link href="/courses/blue" className="hover:text-white">BLUE — Business</Link></div>
              <div><Link href="/courses" className="hover:text-white">All Courses</Link></div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white">Competency</h4>
            <div className="mt-5 space-y-3 text-slate-400">
              <div><Link href="/dashboard" className="hover:text-white">Member Dashboard</Link></div>
              <div><Link href="/assessment" className="hover:text-white">Assessment</Link></div>
              <div><Link href="/passport" className="hover:text-white">Financial Passport</Link></div>
              <div><Link href="/missions" className="hover:text-white">Mission Center</Link></div>
              <div><Link href="/membership" className="hover:text-white">Membership</Link></div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white">Company</h4>
            <div className="mt-5 space-y-3 text-slate-400">
              <div><Link href="/our-story" className="hover:text-white">Our Story</Link></div>
              <div><Link href="/mission" className="hover:text-white">Mission</Link></div>
              <div><Link href="/vision" className="hover:text-white">Vision</Link></div>
              <div><Link href="/features" className="hover:text-white">Features</Link></div>
              <div><Link href="/pricing" className="hover:text-white">Pricing</Link></div>
              <div><Link href="/about" className="hover:text-white">About</Link></div>
              <div><Link href="/contact" className="hover:text-white">Contact</Link></div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white">Community</h4>
            <div className="mt-5 space-y-3 text-slate-400">
              <div><Link href="/family" className="hover:text-white">Family</Link></div>
              <div><Link href="/marketplace" className="hover:text-white">Marketplace</Link></div>
              <div><Link href="/community" className="hover:text-white">Community</Link></div>
              <div><Link href="/webinars" className="hover:text-white">Webinars</Link></div>
              <div><Link href="/faq" className="hover:text-white">FAQ</Link></div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white">Trust &amp; Legal</h4>
            <div className="mt-5 space-y-3 text-slate-400">
              <div><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></div>
              <div><Link href="/terms" className="hover:text-white">Terms of Use</Link></div>
              <div><Link href="/membership-terms" className="hover:text-white">Membership Terms</Link></div>
              <div><Link href="/beta-terms" className="hover:text-white">Beta Terms</Link></div>
              <div><Link href="/trust-center" className="hover:text-white">Trust Center</Link></div>
              <div><Link href="/security" className="hover:text-white">Security</Link></div>
              <div><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></div>
              <div><Link href="/disclaimer" className="hover:text-white">Disclaimer</Link></div>
              <div><Link href="/refund" className="hover:text-white">Refund Policy</Link></div>
            </div>
          </div>

        </div>

        <div className="mt-16 border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Edunancial. All rights reserved.</p>
          <p className="text-center md:text-right max-w-xl">
            {EDUNANCIAL_PUBLIC_DISCLAIMER} Edunancial provides informational content only — not
            financial, investment, tax, accounting, or legal advice. See our{" "}
            <Link href="/disclaimer" className="underline hover:text-slate-300">disclaimer</Link>.
          </p>
        </div>

      </div>
    </footer>
  );
}
