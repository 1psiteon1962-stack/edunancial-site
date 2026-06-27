import Link from "next/link";

export default function Footer() {

return (

<footer className="bg-[#050816] border-t border-gray-800 mt-20">

  <div className="max-w-7xl mx-auto px-6 py-12">

    <div className="grid md:grid-cols-4 gap-8">

      <div>

        <h3 className="font-bold text-xl">
          EDUNANCIAL
        </h3>

        <p className="text-gray-400 mt-3">
          Learn the Language of Wealth.
        </p>

      </div>

      <div>

        <h4 className="font-bold mb-3">
          Learn
        </h4>

        <Link href="/books">Books</Link><br/>
        <Link href="/courses">Courses</Link><br/>
        <Link href="/terms">Financial Terms</Link>

      </div>

      <div>

        <h4 className="font-bold mb-3">
          Company
        </h4>

        <Link href="/about">About</Link><br/>
        <Link href="/contact">Contact</Link>

      </div>

      <div>

        <h4 className="font-bold mb-3">
          Legal
        </h4>

        <Link href="/privacy">Privacy</Link><br/>
        <Link href="/terms-of-service">Terms</Link>

      </div>

    </div>

  </div>

</footer>

);

}
