import { paymentCatalog } from "@/lib/payments/catalog";

export default function AudioBookManager() {
  const audioItems = paymentCatalog.filter((item) =>
    item.metadata?.format?.toLowerCase().includes("audio") ||
    item.name.toLowerCase().includes("audio") ||
    item.description.toLowerCase().includes("audio")
  );

  return (
    <main className="min-h-screen bg-[#08101f] p-6 text-white md:p-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
          Catalog-backed view
        </p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">Audio Book Manager</h1>
        <p className="mt-5 max-w-3xl text-lg text-gray-300">
          This page shows audiobook products that are actually registered in the
          Edunancial payment catalog. The previous file picker and Publish button
          were removed because they were not connected to storage, catalog
          creation, or checkout.
        </p>

        <section className="mt-10 rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          {audioItems.length > 0 ? (
            <div className="grid gap-4">
              {audioItems.map((item) => (
                <article key={item.id} className="rounded-xl border border-white/10 bg-black/10 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-black">{item.name}</h2>
                      <p className="mt-1 text-xs text-gray-500">{item.id}</p>
                    </div>
                    <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-300">
                      {item.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-400">{item.description}</p>
                </article>
              ))}
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-black">No audiobook products are registered.</h2>
              <p className="mt-3 text-gray-400">
                Edunancial will not display a fake publishing workflow. Audiobook
                upload and publishing should return here only after storage,
                metadata persistence, and checkout/catalog registration are wired
                end to end.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
