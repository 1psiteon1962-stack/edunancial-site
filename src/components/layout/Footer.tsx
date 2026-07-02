import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#050b17]">

      <div className="mx-auto max-w-7xl px-6 py-20">

        <h2 className="text-4xl font-black">

          Financial literacy provides the foundation.

        </h2>

        <h3 className="mt-5 text-3xl font-bold text-blue-400">

          Financial competency is built through disciplined action.

        </h3>

        <div className="mt-16 grid gap-10 md:grid-cols-4">

          <div>

            <h4 className="font-bold text-white">

              Learn

            </h4>

            <div className="mt-5 space-y-3">

              <Link href="/courses/red">RED</Link><br/>

              <Link href="/courses/white">WHITE</Link><br/>

              <Link href="/courses/blue">BLUE</Link>

            </div>

          </div>

          <div>

            <h4 className="font-bold">

              Competency

            </h4>

            <div className="mt-5 space-y-3">

              <Link href="/assessment">Assessment</Link><br/>

              <Link href="/passport">Passport</Link><br/>

              <Link href="/missions">Mission Center</Link>

            </div>

          </div>

          <div>

            <h4 className="font-bold">

              Company

            </h4>

            <div className="mt-5 space-y-3">

              <Link href="/why-edunancial">Our Story</Link><br/>

              <Link href="/philosophy">Philosophy</Link><br/>

              <Link href="/about">About</Link>

            </div>

          </div>

          <div>

            <h4 className="font-bold">

              Community

            </h4>

            <div className="mt-5 space-y-3">

              <Link href="/family">Family</Link><br/>

              <Link href="/marketplace">Marketplace</Link>

            </div>

          </div>

        </div>

      </div>

    </footer>
  );
}
