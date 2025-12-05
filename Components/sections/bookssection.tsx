// components/sections/BooksSection.tsx
const books = [
  {
    id: "options-trading",
    title: "Options Trading (White Track)",
    description:
      "From opening a brokerage account to puts, calls, and straddles — at a level new investors can follow.",
    tag: "Paper Assets",
  },
  {
    id: "tax-liens-deeds",
    title: "Building Wealth with Tax Liens & Tax Deeds (Red Track)",
    description:
      "Understand tax liens vs tax deeds, how investors profit, and what happens when you acquire title.",
    tag: "Real Estate",
  },
  {
    id: "business-profit",
    title: "Business Is About Making Profit (Blue Track)",
    description:
      "Simple, direct business foundations: structure, pricing, KPIs, and the discipline behind growth.",
    tag: "Business",
  },
];

export default function BooksSection() {
  return (
    <section className="bg-slate-50 py-16" id="books">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
              Books & Library
            </h2>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              A growing bilingual library for wealth-building.
            </h3>
          </div>
          <p className="max-w-md text-sm text-slate-700">
            Each book will be available in English and Spanish, with matching
            covers and downloadable formats, so families can learn together.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {books.map((book) => (
            <div
              key={book.id}
              className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg hover:ring-blue-500/40"
            >
              <div className="mb-3 h-32 rounded-xl bg-slate-200/80 flex items-center justify-center text-[11px] font-semibold text-slate-600">
                Book cover: {book.title}
              </div>
              <span className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {book.tag}
              </span>
              <h4 className="mb-2 text-lg font-bold text-slate-900">
                {book.title}
              </h4>
              <p className="mb-3 text-sm text-slate-700">
                {book.description}
              </p>
              <p className="mt-auto text-xs font-semibold text-blue-700">
                Coming soon in print, digital, and audio.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
