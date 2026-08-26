import { paymentCatalog } from "@/lib/payments/catalog";

function money(price: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
}

export default function AdminBooksPage() {
  const books = paymentCatalog.filter((item) => item.type === "book");

  return (
    <main className="min-h-screen bg-[#08101f] p-6 text-white md:p-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">Catalog-backed view</p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">Book Administration</h1>
        <p className="mt-5 max-w-3xl text-lg text-gray-300">
          Book products shown here come from the same payment catalog used by checkout. The previous title,
          author, regional-price, and Upload Book controls were removed because they did not persist files or
          create a purchasable product.
        </p>

        <section className="mt-10 rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          {books.length ? (
            <div className="grid gap-4">
              {books.map((book) => (
                <article key={book.id} className="rounded-xl border border-white/10 bg-black/10 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black">{book.name}</h2>
                      <p className="mt-1 text-xs text-gray-500">{book.id}</p>
                    </div>
                    <div className="text-xl font-black">{money(book.price, book.currency)}</div>
                  </div>
                  <p className="mt-3 text-sm text-gray-400">{book.description}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-gray-400">
                    {book.active ? "Active" : "Inactive"} · checkout catalog
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-black">No book products are registered.</h2>
              <p className="mt-3 text-gray-400">
                A real book publishing workflow needs persistent metadata, private file storage, cover storage,
                and automatic payment-catalog registration. Until those pieces are wired together, this admin
                page will report the actual catalog state instead of pretending an upload was published.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
