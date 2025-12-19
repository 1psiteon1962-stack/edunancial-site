import Link from "next/link";

export const metadata = {
  title: "Edunancial | Financial Literacy Without Borders",
  description:
    "Edunancial is a global financial education platform built for the U.S., Africa, Latin America, and the next generation of entrepreneurs.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Edunancial
        </h1>

        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto">
          Financial literacy without borders.
          <br />
          Built for the U.S., Africa, Latin America, and the global economy.
        </p>

        {/* PRIMARY ENTRY BUTTONS */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/en"
            className="px-6 py-3 rounded-md bg-black text-white hover:bg-gray-800 transition"
          >
            Enter (English)
          </Link>

          <Link
            href="/es"
            className="px-6 py-3 rounded-md border border-black hover:bg-gray-100 transition"
          >
            Entrar (Español)
          </Link>
        </div>
      </section>

      {/* PLATFORM OVERVIEW */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3 text-center">
          <div>
            <h3 className="text-xl font-semibold">Learn</h3>
            <p className="mt-2 text-gray-700">
              Courses, books, and structured education across business,
              investing, and entrepreneurship.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Build</h3>
            <p className="mt-2 text-gray-700">
              Tools and frameworks designed for real-world financial decision
              making.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Scale</h3>
            <p className="mt-2 text-gray-700">
              Global-first architecture supporting regional access and local
              markets.
            </p>
          </div>
        </div>
      </section>

      {/* APPS (SAFE PLACEHOLDERS — NO BROKEN ROUTES) */}
      <section className="px-6 py-20 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold">Edunancial Apps</h2>

        <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
          Our interactive applications are coming online in phases. Access will
          expand region by region.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/apps"
            className="px-6 py-3 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition"
          >
            EduMath (Coming Online)
          </Link>

          <Link
            href="/apps"
            className="px-6 py-3 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition"
          >
            EduVesting (Coming Online)
          </Link>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="px-6 py-12 bg-black text-white text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Edunancial. Financial literacy without
          borders.
        </p>
      </section>
    </main>
  );
}
