import Link from "next/link";

export default function AdminTermsPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-20">

        <h1 className="text-6xl font-black">
          Financial Terms Administration
        </h1>

        <p className="mt-6 text-xl text-gray-300">
          Build, edit and publish Red, White and Blue financial term packs.
        </p>

        <div className="grid lg:grid-cols-3 gap-8 mt-16">

          <div className="rounded-3xl border-2 border-red-600 bg-[#151b2d] p-8">

            <h2 className="text-3xl font-black text-red-500">
              Red
            </h2>

            <p className="mt-5 text-gray-300">
              Real Estate terminology.
            </p>

            <Link
              href="/terms/red"
              className="inline-block mt-8 rounded-xl bg-red-600 px-6 py-3 font-bold"
            >
              Manage
            </Link>

          </div>

          <div className="rounded-3xl border-2 border-white bg-[#151b2d] p-8">

            <h2 className="text-3xl font-black">
              White
            </h2>

            <p className="mt-5 text-gray-300">
              Paper Asset terminology.
            </p>

            <Link
              href="/terms/white"
              className="inline-block mt-8 rounded-xl border border-white px-6 py-3 font-bold"
            >
              Manage
            </Link>

          </div>

          <div className="rounded-3xl border-2 border-blue-600 bg-[#151b2d] p-8">

            <h2 className="text-3xl font-black text-blue-500">
              Blue
            </h2>

            <p className="mt-5 text-gray-300">
              Business terminology.
            </p>

            <Link
              href="/terms/blue"
              className="inline-block mt-8 rounded-xl bg-blue-600 px-6 py-3 font-bold"
            >
              Manage
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}
