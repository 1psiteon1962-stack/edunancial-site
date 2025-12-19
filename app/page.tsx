import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edunancial | Financial Literacy Without Borders",
  description:
    "Edunancial is a global financial education platform serving the U.S., Africa, Latin America, and emerging markets.",
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
          Financial literacy without borders. Built for the United States,
          Africa, Latin America, and the next generation of global entrepreneurs.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/en"
            className="px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            Enter (English)
          </Link>

          <Link
            href="/es"
            className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Entrar (Español)
          </Link>
        </div>
      </section>

      {/* REGIONAL ACCESS */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold">🇺🇸 United States</h3>
            <p className="mt-2 text-sm text-gray-600">
              Core education, investing fundamentals, business structure,
              compliance, and advanced tools.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">🌍 Africa</h3>
            <p className="mt-2 text-sm text-gray-600">
              Mobile-first education, entrepreneurship, local payments, and
              cross-border opportunity access.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">🌎 Latin America</h3>
            <p className="mt-2 text-sm text-gray-600">
              Business ownership, financial independence, and global expansion
              pathways.
            </p>
          </div>
        </div>
      </section>

      {/* PLATFORM */}
      <section className="px-6 py-20 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          One Platform. Multiple Futures.
        </h2>

        <p className="mt-6 max-w-3xl mx-auto text-gray-700">
          Edunancial unifies education, decision tools, and capital awareness
          through structured learning paths, regional adaptation, and scalable
          technology.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/apps/edumath"
            className="px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            EduMath (Live)
          </Link>

          <Link
            href="/apps/edinvesting"
            className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            EduVesting (Live)
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-10 border-t text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Edunancial. Education before capital.
      </footer>
    </main>
  );
}
