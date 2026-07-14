import Link from "next/link";

export default function HomeRedWhiteBlue() {
  return (
    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-center text-6xl font-black">
          Three Asset Classes.
          <br />
          One System.
        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-3">

          <Link
            href="/courses/red-real-estate"
            className="rounded-xl bg-red-700 p-10"
          >

            <h3 className="text-4xl font-black">
              RED
            </h3>

            <p className="mt-8 text-xl">
              Real Estate
            </p>

          </Link>

          <Link
            href="/courses/white-paper-assets"
            className="rounded-xl bg-white p-10 text-slate-900"
          >

            <h3 className="text-4xl font-black">
              WHITE
            </h3>

            <p className="mt-8 text-xl">
              Paper Assets
            </p>

          </Link>

          <Link
            href="/courses/blue-business"
            className="rounded-xl bg-blue-700 p-10"
          >

            <h3 className="text-4xl font-black">
              BLUE
            </h3>

            <p className="mt-8 text-xl">
              Business
            </p>

          </Link>

        </div>

      </div>

    </section>
  );
}
