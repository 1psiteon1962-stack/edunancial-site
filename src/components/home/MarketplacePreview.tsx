import Link from "next/link";

export default function MarketplacePreview() {
  return (
    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          MARKETPLACE
        </p>

        <h2 className="mt-6 text-6xl font-black">
          Learn. Connect. Apply.
        </h2>

        <p className="mt-8 max-w-4xl text-2xl leading-10 text-slate-300">
          Connect with trusted professionals who can help you implement
          what you learn.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {[
            "Attorneys",
            "Accountants",
            "Lenders",
            "Business Advisors"
          ].map((item) => (

            <div
              key={item}
              className="rounded-xl bg-slate-900 p-8 text-center"
            >
              <h3 className="text-2xl font-bold">
                {item}
              </h3>
            </div>

          ))}

        </div>

        <div className="mt-16">

          <Link
            href="/marketplace"
            className="rounded-xl bg-blue-600 px-10 py-5 font-bold hover:bg-blue-700"
          >
            Explore Marketplace
          </Link>

        </div>

      </div>

    </section>
  );
}
