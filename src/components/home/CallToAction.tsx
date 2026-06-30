import Link from "next/link";

export default function CallToAction() {

  return (

    <section className="bg-blue-600 py-24">

      <div className="mx-auto max-w-5xl px-6 text-center">

        <h2 className="text-5xl font-black text-white">
          Start Building Wealth Today
        </h2>

        <p className="mt-8 text-xl text-white">
          Learn. Earn. Save. Invest. Build Wealth.
        </p>

        <Link
          href="/courses"
          className="mt-10 inline-block rounded-xl bg-white px-10 py-5 text-xl font-bold text-blue-700"
        >
          Start Learning
        </Link>

      </div>

    </section>

  );

}
