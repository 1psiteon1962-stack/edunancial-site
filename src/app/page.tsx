import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      {/* HERO */}

      <section className="relative overflow-hidden">

        <div className="mx-auto max-w-7xl px-6 py-28 text-center">

          <p className="text-lg uppercase tracking-[0.45em] text-gray-400">

            Financial Literacy for Ordinary People

          </p>

          <h1 className="mt-10 text-7xl md:text-8xl font-black leading-none">

            <span className="block text-red-500">
              RED.
            </span>

            <span className="block text-white">
              WHITE.
            </span>

            <span className="block text-blue-500">
              BLUE.
            </span>

          </h1>

          <div className="mx-auto mt-10 h-2 w-full max-w-4xl rounded-full bg-gradient-to-r from-red-600 via-white to-blue-600" />

          <p className="mx-auto mt-12 max-w-4xl text-3xl leading-relaxed text-gray-300">

            Real Estate. Paper Assets. Business.

          </p>

          <p className="mx-auto mt-5 max-w-4xl text-2xl leading-relaxed text-gray-400">

            Three Pillars. One Mission.

            <br />

            Economic Self Defense.

          </p>

          <div className="mt-16 flex flex-wrap justify-center gap-6">

            <Link
              href="/books"
              className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
            >
              Explore Books
            </Link>

            <Link
              href="/terms"
              className="rounded-xl border border-white px-10 py-5 text-xl font-bold hover:bg-white hover:text-black"
            >
              Financial Terms
            </Link>

          </div>

        </div>

      </section>

      {/* RED */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <h2 className="text-5xl font-black text-red-500">

          RED — Real Estate

        </h2>

        <p className="mt-8 text-xl text-gray-300">

          Rental Property • Tax Liens • Tax Deeds • Creative Financing •
          Commercial Real Estate • 1031 Exchanges

        </p>

      </section>

      {/* WHITE */}

      <section className="bg-[#111827]">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <h2 className="text-5xl font-black">

            WHITE — Paper Assets

          </h2>

          <p className="mt-8 text-xl text-gray-300">

            Budgeting • Stocks • ETFs • Options • Precious Metals •
            Retirement Accounts • Risk Management

          </p>

        </div>

      </section>

      {/* BLUE */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <h2 className="text-5xl font-black text-blue-500">

          BLUE — Business

        </h2>

        <p className="mt-8 text-xl text-gray-300">

          Entrepreneurship • Marketing • Pricing • KPIs • Inventory •
          Profit • Scaling

        </p>

      </section>

      {/* FOOTER */}

      <section className="bg-[#0b1326]">

        <div className="mx-auto max-w-7xl px-6 py-20 text-center">

          <h2 className="text-5xl font-black">

            Economic Self Defense

          </h2>

          <p className="mt-8 text-xl text-gray-300">

            Learn. Earn. Save. Invest. Build Wealth.

          </p>

        </div>

      </section>

    </main>
  );
}
