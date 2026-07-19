import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-[#050816] border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-4">

        <div>
          <h2 className="text-2xl font-black tracking-widest text-white">
            EDUNANCIAL
          </h2>

          <p className="mt-4 text-gray-400 leading-7">
            Financial Literacy for Ordinary People.
            Learn.
            Earn.
            Save.
            Invest.
            Build Wealth.
          </p>
        </div>

        <div>
          <h3 className="text-white font-bold mb-5">
            Education
          </h3>

          <div className="space-y-3 text-gray-400">
            <Link href="/marketplace">Marketplace</Link><br/>
            <Link href="/courses">Courses</Link><br/>
            <Link href="/terms">Financial Terms</Link><br/>
            <Link href="/downloads">Downloads</Link>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-5">
            Company
          </h3>

          <div className="space-y-3 text-gray-400">
            <Link href="/about">About</Link><br/>
            <Link href="/contact">Contact</Link><br/>
            <Link href="/faq">FAQ</Link><br/>
            <Link href="/membership">Membership</Link>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-5">
            Legal
          </h3>

          <div className="space-y-3 text-gray-400">
            <Link href="/privacy">Privacy Policy</Link><br/>
            <Link href="/terms">Terms of Use</Link><br/>
            <Link href="/refund">Refund Policy</Link><br/>
            <Link href="/disclaimer">Disclaimer</Link>
          </div>
        </div>

      </div>

      <div className="border-t border-white/10 py-8 text-center text-gray-500">
        © {new Date().getFullYear()} Edunancial.
        All Rights Reserved.
      </div>
    </footer>
  );
}
