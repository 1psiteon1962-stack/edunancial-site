import PaymentButtons from "@/components/PaymentButtons";
import OurStory from "@/components/OurStory";

export const metadata = {
  title: "Edunancial | Financial Literacy Without Borders",
  description:
    "Edunancial is a global financial literacy platform focused on structure, readiness, and long-term wealth durability for founders, families, and future generations."
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Financial Literacy Without Borders
        </h1>

        <p className="mt-6 text-lg md:text-xl max-w-3xl">
          Edunancial exists to build financial clarity, discipline, and long-term
          economic durability — not hype, not speculation, and not shortcuts.
        </p>

        <p className="mt-4 text-lg max-w-3xl">
          Built for founders, entrepreneurs, families, and youth preparing for
          real-world financial responsibility across the U.S., Africa, Latin
          America, and emerging global markets.
        </p>

        <div className="mt-10">
          <PaymentButtons />
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <span className="px-3 py-1 border rounded">Site: us-main</span>
          <span className="px-3 py-1 border rounded">Region: US</span>
          <span className="px-3 py-1 border rounded">Language: en</span>
          <span className="px-3 py-1 border rounded">Role: primary</span>
        </div>
      </section>

      {/* RED / WHITE / BLUE */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 grid gap-10 md:grid-cols-3">
          
          {/* RED */}
          <div>
            <h2 className="text-xl font-semibold text-red-700">RED — Real Assets</h2>
            <p className="mt-4">
              Understanding property, cash-flowing assets, and durability.
              Focused on ownership, leverage discipline, and downside protection.
            </p>
          </div>

          {/* WHITE */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800">WHITE — Paper Assets</h2>
            <p className="mt-4">
              Markets, options, valuation logic, and risk literacy — taught as
              systems, not speculation or advice.
            </p>
          </div>

          {/* BLUE */}
          <div>
            <h2 className="text-xl font-semibold text-blue-700">BLUE — Business Ownership</h2>
            <p className="mt-4">
              Entity structure, governance, operational discipline, and building
              companies that survive cycles and scale responsibly.
            </p>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <OurStory />
    </main>
  );
}
