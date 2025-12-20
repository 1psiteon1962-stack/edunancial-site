import { resolveContent } from "@/lib/content-resolver";
import Link from "next/link";

export const metadata = {
  title: "Edunancial | Financial Literacy Without Borders",
  description:
    "Edunancial is a global financial education platform serving the U.S., Africa, and emerging markets.",
};

export default function HomePage() {
  // Primary site defaults
  const region = "us";
  const lang = "en";

  const content = resolveContent(region, lang);

  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-12 max-w-6xl mx-auto">
      {/* HERO */}
      <section className="mb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          {content.hero.title}
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-3xl">
          {content.hero.subtitle}
        </p>
      </section>

      {/* OUR STORY */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
        <p className="max-w-3xl text-lg leading-relaxed">
          {content.story}
        </p>
      </section>

      {/* RED / WHITE / BLUE */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6">
          The Edunancial Framework
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {content.framework.map((pillar: any) => (
            <div
              key={pillar.color}
              className="border rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold mb-2">
                {pillar.title}
              </h3>
              <p className="text-gray-700">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* APPS */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6">Apps</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {content.apps.map((app: any) => (
            <div key={app.slug} className="border rounded-xl p-6">
              <h3 className="text-xl font-bold">{app.name}</h3>
              <p className="mt-2 text-gray-700">{app.description}</p>

              {/* PAYMENT PLACEHOLDER */}
              <button
                disabled
                className="mt-4 px-4 py-2 rounded bg-gray-300 text-gray-600 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKS */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6">Books</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {content.books.map((book: any) => (
            <div key={book.slug} className="border rounded-xl p-6">
              <h3 className="font-bold">{book.title}</h3>
              <p className="mt-2 text-gray-700">{book.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER STATUS */}
      <footer className="text-sm text-gray-500 mt-24">
        <div className="flex flex-wrap gap-3">
          <span>Site: us-main</span>
          <span>Region: US</span>
          <span>Lang: en</span>
          <span>Role: primary</span>
        </div>
      </footer>
    </main>
  );
}
