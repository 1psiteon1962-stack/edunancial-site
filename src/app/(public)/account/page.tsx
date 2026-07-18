import Link from "next/link";

export default function AccountPage() {

  return (

    <main className="min-h-screen bg-[#0a0f1e] text-white">

      <section className="max-w-6xl mx-auto px-6 py-20">

        <h1 className="text-5xl font-black">

          My Account

        </h1>

        <div className="grid md:grid-cols-2 gap-8 mt-16">

          <Link
            href="/downloads"
            className="rounded-2xl bg-[#151b2d] p-8 hover:bg-[#1f2937]"
          >

            <h2 className="text-3xl font-black">

              Downloads

            </h2>

            <p className="mt-4 text-gray-300">

              Access purchased eBooks.

            </p>

          </Link>

          <Link
            href="/membership"
            className="rounded-2xl bg-[#151b2d] p-8 hover:bg-[#1f2937]"
          >

            <h2 className="text-3xl font-black">

              Membership

            </h2>

            <p className="mt-4 text-gray-300">

              View your membership status.

            </p>

          </Link>

        </div>

      </section>

    </main>

  );

}
