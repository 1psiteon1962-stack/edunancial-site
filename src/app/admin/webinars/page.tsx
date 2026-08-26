import { paymentCatalog } from "@/lib/payments/catalog";

export default function WebinarAdmin() {
  const webinarProducts = paymentCatalog.filter(
    (item) => item.type === "webinar" || item.type === "live_training"
  );

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
          Owner operations
        </p>
        <h1 className="mt-3 text-4xl font-black md:text-5xl">Webinar Manager</h1>
        <p className="mt-5 max-w-3xl text-lg text-slate-300">
          This screen shows webinar and live-training products that are actually
          connected to Edunancial&apos;s checkout catalog. The previous Publish
          Webinar form was removed because it did not save or publish anything.
        </p>

        {webinarProducts.length > 0 ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {webinarProducts.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-white/10 bg-slate-900 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black">{item.name}</h2>
                    <p className="mt-1 text-xs text-slate-500">{item.id}</p>
                  </div>
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase text-emerald-300">
                    {item.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-300">{item.description}</p>
                <p className="mt-4 text-lg font-black">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: item.currency,
                  }).format(item.price)}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <section className="mt-10 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6">
            <h2 className="text-xl font-black text-amber-100">
              No webinar products are live
            </h2>
            <p className="mt-2 text-amber-100/80">
              Edunancial does not currently have a wired webinar scheduling and
              publishing backend. Rather than display a button that cannot publish,
              this page will remain read-only until that capability is connected to
              a real event data source and customer registration workflow.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
